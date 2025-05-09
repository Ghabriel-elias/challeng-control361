'use client'
import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { RadioComponent } from "@/components/RadioComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { InputComponent } from "@/components/InputComponent";
import { TableCell, TableCellLoading } from "@/components/TableCellComponent";
import { TableHeaderComponent } from "@/components/TableHeaderComponent";
import { LocationVehicle, Vehicle, VehicleResponse } from "@/interfaces/vehicleInterfaces";
import {MarkerComponent} from "@/components/MarkerComponent";
import { fecthVehicles } from "@/services/api";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const status = {
  active: 'Ativo',
}

const type = {
  vehicle: 'Motor',
  implement: 'Implemento'
}

export default function Home() {

  const [filterType, setFilterType] = useState<'tracked' | 'others'>('tracked')
  const inputRef = useRef<HTMLInputElement>(null);
  const debounce = useDebounce()
  const [isFocused, setIsFocuses] = useState(false)
  const [data, setData] = useState({} as VehicleResponse['content'])
  const [vehiclesLocation, setVehiclesLocation] = useState<LocationVehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<LocationVehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  })
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  function handleInput(text: string) {
    debounce(() => {
      fecthVehiclesTable(text)
    })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyB') {
      e.preventDefault(); 
      inputRef.current?.focus();
    }
  };

  async function fecthVehiclesTable(filter?: string, filterTypeParam?: 'tracked' | 'others', page?: number) {
    try {
      setLoading(true)
      const {content} = await fecthVehicles({
        page,
        filter: filter,
        filterTypeParam: filterTypeParam || filterType
      })
      if(filterTypeParam) {
        setFilterType(filterTypeParam)
        setData(content)
        return
      }
      const dataVehicles = data?.vehicles?.length ? data?.vehicles : []
      setData({...content, vehicles: [...dataVehicles, ...content?.vehicles]})
    } catch (error) {
      enqueueSnackbar('Erro ao buscar veículos', {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  async function fecthVehiclesLocation() {
    try {
      const {content} = await fecthVehicles({
        perPage: 0
      })
      setVehiclesLocation(content.locationVehicles)
    } catch (error) {
      enqueueSnackbar('Erro ao buscar localização de veículos', {
        variant: 'error',
      })
    }
  }

  const MapComponent = useMemo(() => {
    return (
      <div className="mt-6 p-4 bg-blue-15 rounded-2xl border-blue-30 border-1">
        <p className="font-medium text-md">Mapa rastreador</p>
        {isLoaded && vehiclesLocation?.length ? (
          <GoogleMap
            mapContainerClassName="map-container"
            center={map?.getCenter() || { 
              lat: Number(vehiclesLocation?.at(0)?.lat), 
              lng: Number(vehiclesLocation?.at(0)?.lng) 
            }}
            zoom={5}
            onLoad={onLoad}
            >
            {vehiclesLocation?.map((item) => (
              <MarkerComponent 
                key={item?.id + item?.lat + item?.lng}
                item={item} 
                onClick={() => {
                  if(JSON.stringify(selectedVehicle) === JSON.stringify(item)) {
                    setSelectedVehicle(null)
                    return
                  }
                  setSelectedVehicle(item)
                  if(map) {
                    map.setZoom(15)
                    map.setCenter({ lat: Number(item?.lat), lng: Number(item?.lng) })
                  }
                }} 
                isSelected={JSON.stringify(selectedVehicle) === JSON.stringify(item)}
              />
            ))}
          </GoogleMap>
        ) : <Skeleton width={'100%'} className="map-container" />}
      </div>
    )
  }, [isLoaded, vehiclesLocation, selectedVehicle, map]);

  useEffect(() => {
    fecthVehiclesLocation()
    fecthVehiclesTable()
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      if (scrollTop + clientHeight >= scrollHeight && !loading) {
        console.log(data?.totalPages)
        if(page >= data?.totalPages) return
        setPage((prevPage) => prevPage + 1);
        fecthVehiclesTable('',filterType, page + 1)
      }
    }
}

  useEffect(() => {
    const tableElement = tableRef.current;
    if(!tableElement) return
    tableElement?.addEventListener('scroll', handleScroll);
    
    return () => {
      tableElement?.removeEventListener('scroll', handleScroll);
    };
  }, [loading, page]);

  return (
    <SkeletonTheme baseColor="var(--color-grey-primary)" highlightColor="var(--color-grey-secondary)" >
    <div className="flex min-h-screen flex-col">
      <SnackbarProvider />
      <div className="bg-blue-20 flex min-w-screen h-14 items-center pl-6">
        <p className="font-medium text-lg">Ghabriel Elias</p>
      </div>
      <div className="flex pl-9 pr-9 min-w-screen mb-10 flex-col">
        <div className="border-b-1 border-b-blue-30 w-full h-20 gap-1 items-center justify-center flex sm:justify-between flex-col sm:flex-row">
          <div className="sm:w-1/2 w-full flex flex-row sm:justify-end justify-between gap-">
            <p className="font-semibold text-base">Lista</p>
            <div className="flex flex-row gap-4 w-full sm:justify-center justify-end">
              <RadioComponent 
                isSelected={filterType === 'tracked'}
                onClick={() => fecthVehiclesTable('','tracked')}
                text="Rastreados"
              />
              <RadioComponent 
                isSelected={filterType === 'others'}
                onClick={() => fecthVehiclesTable('','others')}
                text="Outros"
              />
            </div>
          </div>
          <div className="sm:w-1/2 w-full flex flex-row sm:justify-end justify-between gap-4">
            <InputComponent
              handleInput={handleInput}
              inputRef={inputRef}
              isFocused={isFocused}
              onFocus={() => setIsFocuses(true)}
              onBlur={() => setIsFocuses(false)}
              placeholder="Buscar por placa ou frota"
              className="w-64"
            />
            <ButtonComponent text="Novo" onClick={() => {}} className="bg-blue-primary h-10 w-36"/>
          </div>
        </div>
        {MapComponent}
        <div ref={tableRef} className="mt-6 bg-blue-15 rounded-2xl border-blue-30 border-1 overflow-hidden no-scrollbar overflow-y-scroll h-auto max-h-96">
          <div className="grid grid-cols-5 h-14 border-b-1 z-50 border-blue-30 sticky top-0 bg-blue-15">
            <TableHeaderComponent text="Placa"/>
            <TableHeaderComponent text="Frota"/>
            <TableHeaderComponent text="Tipo"/>
            <TableHeaderComponent text="Modelo"/>
            <TableHeaderComponent text="Status" hasBorder={false}/>
          </div>
          {data?.vehicles?.length ? data?.vehicles.map((item) => (
            <>
              <div key={item?.id} className={`grid grid-cols-5 h-10 ${item?.id === data?.vehicles?.at(-1)?.id ? '' : 'border-b-1'} border-blue-30`}>
                <TableCell text={item?.plate}/>
                <TableCell text={item?.fleet || '-'}/>
                <TableCell text={type[item.type]}/>
                <TableCell text={item?.model}/>
                <TableCell text={item?.status} hasBorder={false} />
              </div>
            </>
          )) : null}
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid grid-cols-5 h-10 border-t-1 border-blue-30">
                <TableCellLoading />
                <TableCellLoading />
                <TableCellLoading />
                <TableCellLoading />
                <TableCellLoading hasBorder={false} />
              </div>
            ))
          ) : null}
        </div>
      </div>
    </div>
    </SkeletonTheme>
  );
}
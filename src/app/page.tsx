'use client'
import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { RadioComponent } from "@/components/RadioComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { InputComponent } from "@/components/InputComponent";
import { TableCell } from "@/components/TableCellComponent";
import { TableHeaderComponent } from "@/components/TableHeaderComponent";
import { LocationVehicle, Vehicle } from "@/interfaces/vehicleInterfaces";
import {MarkerComponent} from "@/components/MarkerComponent";
import { fecthVehicles } from "@/services/api";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

const center = {
  lat: -3.745,
  lng: -38.523,
}

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehiclesLocation, setVehiclesLocation] = useState<LocationVehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<LocationVehicle | null>(null)
  const [page, setPage] = useState(1)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  })

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

  async function fecthVehiclesTable(filter?: string, filterTypeParam?: 'tracked' | 'others') {
    try {
      const response = await fecthVehicles({
        page,
        filter: filter,
        filterTypeParam: filterTypeParam || filterType
      })
      if(filterTypeParam) {
        setFilterType(filterTypeParam)
      }
      setVehicles(response.content.vehicles)
    } catch (error) {
      enqueueSnackbar('Erro ao buscar veículos', {
        variant: 'error',
      })
    }
  }

  async function fecthVehiclesLocation() {
    try {
      const response = await fecthVehicles({
        perPage: 0
      })
      setVehiclesLocation(response.content.locationVehicles)
    } catch (error) {
      enqueueSnackbar('Erro ao buscar localização de veículos', {
        variant: 'error',
      })
    }
  }

  const MapComponent = useMemo(() => {
    return (
      isLoaded && vehiclesLocation?.length ? (
        <div className="mt-6 p-4 bg-blue-15 rounded-2xl border-blue-30 border-1">
          <p className="font-medium text-md">Mapa rastreador</p>
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
        </div>
      ) : null
    )
  }, [isLoaded, vehiclesLocation, selectedVehicle, map]);

  useEffect(() => {
    fecthVehiclesLocation()
    fecthVehiclesTable()
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
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
        <div className="mt-6 bg-blue-15 rounded-2xl border-blue-30 border-1 overflow-hidden no-scrollbar overflow-y-scroll h-auto max-h-96">
          <div className="grid grid-cols-5 h-14 border-b-1 border-blue-30 sticky top-0 bg-blue-15">
            <TableHeaderComponent text="Placa"/>
            <TableHeaderComponent text="Frota"/>
            <TableHeaderComponent text="Tipo"/>
            <TableHeaderComponent text="Modelo"/>
            <TableHeaderComponent text="Status" hasBorder={false}/>
          </div>
          {vehicles.map((item) => (
            <div key={item?.id} className={`grid grid-cols-5 h-10 ${item?.id === vehicles?.at(-1)?.id ? '' : 'border-b-1'} border-blue-30`}>
              <TableCell text={item?.plate}/>
              <TableCell text={item?.fleet || '-'}/>
              <TableCell text={type[item.type]}/>
              <TableCell text={item?.model}/>
              <TableCell text={item?.status} hasBorder={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client'
import { useDebounce } from "@/hooks/useDebounce";
import { LocationVehicle, VehicleResponse } from "@/interfaces/vehicleInterfaces";
import { fecthVehicles } from "@/services/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";

export const useHomeModel = () => {

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
  const timerUpdateMapRef = useRef<NodeJS.Timeout>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  function onLoad(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }

  function handleInput(text: string) {
    debounce(() => {
      fecthVehiclesTable(filterType, page, text)
    })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyB') {
      e.preventDefault(); 
      inputRef.current?.focus();
    }
  };

  async function fecthVehiclesTable(filterTypeParam?: 'tracked' | 'others' | null, page?: number, filter?: string) {
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

  function startPoolingMap() {
    timerUpdateMapRef.current = setInterval(() => {
      fecthVehiclesLocation();
    }, (1000 * 60) * 2);
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

  function handleClickOnTruck(item: LocationVehicle) {
    if(JSON.stringify(selectedVehicle) === JSON.stringify(item)) {
      setSelectedVehicle(null)
      return
    }
    setSelectedVehicle(item)
    if(map) {
      map.setZoom(15)
      map.setCenter({ lat: Number(item?.lat), lng: Number(item?.lng) })
    }
  }

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      if ((Math.round(scrollTop) + clientHeight) >= scrollHeight && !loading) {
        if (page >= data?.totalPages) return;
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fecthVehiclesTable(null, nextPage);
          return nextPage;
        });
      }
    }
  };

  return {
    filterType,
    inputRef,
    fecthVehiclesTable,
    handleInput,
    setIsFocuses,
    tableRef,
    data,
    loading,
    isFocused,
    fecthVehiclesLocation,
    handleKeyDown,
    handleScroll,
    page,
    handleClickOnTruck,
    isLoaded,
    vehiclesLocation,
    map,
    onLoad,
    selectedVehicle,
    startPoolingMap
  }
}
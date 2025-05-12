'use client'
import { useDebounce } from "@/hooks/useDebounce";
import { LocationVehicle, Vehicle } from "@/interfaces/vehicleInterfaces";
import { fetchVehicles } from "@/services/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";

export const useHomeModel = () => {

  const [filterType, setFilterType] = useState<'tracked' | 'others'>('tracked')
  const debounce = useDebounce()
  const [isFocused, setIsFocuses] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<LocationVehicle | null>(null)
  const [page, setPage] = useState(1)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  })
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('')
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const timerUpdateMapRef = useRef<NodeJS.Timeout>(null);
  
  const {data, isFetching, refetch} = useQuery({
    queryKey: ['vehicles', page, filterType, inputValue],
    queryFn: () => fetchVehicles({
      page,
      filter: inputValue,
      filterTypeParam: filterType
    }).then((res) => {
      setVehicles([...vehicles?.filter(vehicle => res?.content?.vehicles?.find(v => JSON.stringify(v) !== JSON.stringify(vehicle))), ...res?.content?.vehicles])
      return res?.content;
    }).catch((error) => {
      enqueueSnackbar('Erro ao buscar veículos', {
        variant: 'error',
      });
    }),
  })

  function startPoolingMap() {
    timerUpdateMapRef.current = setInterval(() => {
      refetch();
    }, (1000 * 60) * 2);
  }

  function onLoad(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }

  function handleInput(text: string) {
    debounce(() => {
      setVehicles([])
      setPage(1)
      setInputValue(text)
    })
  }

  function handleRadio(value: 'tracked' | 'others') {
    setVehicles([])
    setPage(1)
    setFilterType(value)
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
      if ((Math.round(scrollTop) + clientHeight) >= scrollHeight && !isFetching) {
        if (page >= (data?.totalPages || 0)) return;
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  return {
    filterType,
    isFocused,
    setIsFocuses,
    handleInput,
    data,
    tableRef,
    handleScroll,
    page,
    handleClickOnTruck,
    isLoaded,
    map,
    onLoad,
    selectedVehicle,
    isFetching,
    handleRadio,
    vehicles,
    inputValue,
    startPoolingMap
  }
}
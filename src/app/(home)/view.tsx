'use client'
import { RadioComponent } from "@/components/RadioComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { InputComponent } from "@/components/InputComponent";
import { TableCell, TableCellLoading } from "@/components/TableCellComponent";
import { TableHeaderComponent } from "@/components/TableHeaderComponent";
import 'react-loading-skeleton/dist/skeleton.css'
import { useHomeModel } from "./model";
import { useEffect, useMemo } from "react";
import { MapComponent } from "@/components/MapComponent";

const status = {
  active: 'Ativo',
  onTravel: 'Em viagem',
  inactive: 'Inativo',
  maintenance: 'Em manutenção',
}

const type = {
  vehicle: 'Motor',
  implement: 'Implemento'
}

type HomeViewProps = ReturnType<typeof useHomeModel>

export function HomeView(props: HomeViewProps) {
  const {
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
  } = props

  const MemoizedMap = useMemo(() => {
    return (
      <MapComponent
        isLoaded={isLoaded}
        map={map}
        onLoad={onLoad}
        vehiclesLocation={data?.locationVehicles || []}
        selectedVehicle={selectedVehicle}
        handleClickOnTruck={handleClickOnTruck}
        loading={isFetching}
      />
    );
  }, [isLoaded, data, selectedVehicle, map, isFetching]);

  useEffect(() => {
    startPoolingMap()
  }, [])

  useEffect(() => {
    const tableElement = tableRef.current;
    if(!tableElement) return
    tableElement?.addEventListener('scroll', handleScroll);
    
    return () => {
      tableElement?.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching, page, data]);

  return (
    <>
      <div className="bg-blue-20 flex h-14 items-center pl-6">
        <p className="font-medium text-lg">Ghabriel Elias</p>
      </div>
      <div className="border-b-1 pl-9 pr-9 bg-blue-10 border-b-blue-30 w-full sm:h-20 h-24 gap-2 items-center justify-center flex sm:justify-between flex-col sm:flex-row">
        <div className="sm:w-1/2 w-full flex flex-row sm:justify-end justify-between gap-">
          <p className="font-semibold text-base">Lista</p>
          <div className="flex flex-row gap-4 w-full sm:justify-center justify-end">
            <RadioComponent 
              isSelected={filterType === 'tracked'}
              onClick={() => handleRadio('tracked')}
              text="Rastreados"
            />
            <RadioComponent 
              isSelected={filterType === 'others'}
              onClick={() => handleRadio('others')}
              text="Outros"
            />
          </div>
        </div>
        <div className="sm:w-1/2 w-full flex flex-row sm:justify-end justify-between gap-4">
          <InputComponent
            handleInput={handleInput}
            isFocused={isFocused}
            onFocus={() => setIsFocuses(true)}
            onBlur={() => setIsFocuses(false)}
            placeholder="Buscar por placa ou frota"
            className="w-64"
          />
          <ButtonComponent text="Novo" onClick={() => {}} className="bg-blue-primary h-10 w-36"/>
        </div>
      </div>
      <div ref={tableRef} className="pl-9 pr-5 pb-9 overflow-y-auto max-h-[calc(100vh-136px)]">
        {MemoizedMap}
        <div className="mt-6 bg-blue-15 rounded-2xl border-blue-30 border-1">
          <div className="grid grid-cols-5 h-14 border-b-1 z-50 rounded-t-2xl border-blue-30 sticky -top-1 bg-blue-15">
            <TableHeaderComponent text="Placa"/>
            <TableHeaderComponent text="Frota"/>
            <TableHeaderComponent text="Tipo"/>
            <TableHeaderComponent text="Modelo"/>
            <TableHeaderComponent text="Status" hasBorder={false}/>
          </div>
          {vehicles?.length ? vehicles.map((item, index) => (
            <div key={item?.id + index} className={`grid grid-cols-5 h-10 ${item?.id === vehicles?.at(-1)?.id ? '' : 'border-b-1'} border-blue-30`}>
              <TableCell text={item?.plate}/>
              <TableCell text={item?.fleet || '-'}/>
              <TableCell text={type[item.type]}/>
              <TableCell text={item?.model}/>
              <TableCell text={status[item?.status]} hasBorder={false} />
            </div>
          )) : !isFetching ? (
            <div className="flex flex-col items-center justify-center h-20">
              <p className="font-medium text-md text-center">{inputValue ? 'Nenhum veículo encontrado para esses parâmetros' : 'Sem veículos para exibir'}</p>
            </div>
          ) : null}
          {isFetching ? (
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
    </>
  );
}
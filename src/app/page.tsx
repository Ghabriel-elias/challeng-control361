'use client'
import { GlobalIcon } from "@/components/GlobalIcon";
import { useDebounce } from "@/hooks/useDebounce";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

interface RadioComponentProps {
  onClick: () => void
  text: string
  isSelected: boolean
}

const RadioComponent = ({
  isSelected,
  text,
  onClick
}: RadioComponentProps) => {
  return (
    <div className="flex flex-row gap-2 cursor-pointer" onClick={onClick}>
      <GlobalIcon className="mt-0.5" iconName={isSelected ? "IoMdRadioButtonOn" : "IoMdRadioButtonOff"} color="var(--color-blue-primary)"/>
      <p className="font-normal text-sm">{text}</p>
    </div>
  )
}

interface ButtonComponentProps {
  onClick: () => void
  text: string
  className?: HTMLAttributes<HTMLDivElement>['className']
}

const ButtonComponent = ({
  onClick,
  text,
  className
}: ButtonComponentProps) => {
  return (
    <button className={`rounded-lg flex items-center justify-center cursor-pointer ${className ?? ''}`} onClick={onClick}>
      <p className="font-semibold text-sm">{text}</p>
    </button>
  )
}

export default function Home() {

  const [filterType, setFilterType] = useState<'tracked' | 'others'>('tracked')
  const inputRef = useRef<HTMLInputElement>(null);
  const debounce = useDebounce()
  const [isFocused, setIsFocuses] = useState(false)

  function handleInput(text: string) {
    debounce(() => {
      console.log({text})
    })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyB') {
      e.preventDefault(); 
      inputRef.current?.focus();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-blue-20 flex min-w-screen h-14 items-center pl-6">
        <p className="font-medium text-lg">Ghabriel Elias</p>
      </div>
      <div className="flex pl-9 pr-9 min-w-screen h-20">
        <div className="border-b-1 border-b-blue-30 w-full h-full items-center flex">
          <div className="w-1/2 flex flex-row">
            <p className="font-semibold text-base">Lista</p>
            <div className="flex flex-row gap-4 w-full justify-center">
              <RadioComponent 
                isSelected={filterType === 'tracked'}
                onClick={() => setFilterType('tracked')}
                text="Rastreados"
              />
              <RadioComponent 
                isSelected={filterType === 'others'}
                onClick={() => setFilterType('others')}
                text="Outros"
              />
            </div>
          </div>
          <div className="w-1/2 flex flex-row justify-end gap-4">
            <div className={`${isFocused ?  'border-white' : 'border-grey-border'} border-1 flex flex-row items-center rounded-lg h-10 w-64 pr-2`}>
              <input
                placeholder="Buscar por placa ou frota"
                className="pl-2.5 pr-2.5 h-full w-full border-none outline-none font-light text-sm placeholder-grey bg-transparent"
                ref={inputRef}
                onChange={(ev) => handleInput(ev.target.value)}
                onFocus={() => {
                  setIsFocuses(true)
                }}
                onBlur={() => {
                  setIsFocuses(false)
                }}
              />
              {/* <div className="rounded-sm pl-1.5 pr-1.5 text-grey-secondary border-1">
                <p className="font-semibold text-md text-grey-secondary">B</p>
              </div> */}
            </div>
            <ButtonComponent text="Novo" onClick={() => {}} className="bg-blue-primary h-10 w-36"/>
          </div>
        </div>
      </div>
    </div>
  );
}

import { InfoWindow, OverlayView } from "@react-google-maps/api"
import { TruckIcon } from "../../../public/assets"
import { LocationVehicle } from "@/interfaces/vehicleInterfaces"
import { getRandomDarkHexColor } from "@/utils/getRandomDarkHexColor";
import dayjs from "dayjs";
import { IconComponent } from "../IconComponent";

interface MarkerComponentProps {
  item: LocationVehicle;
  onClick?: () => void;
  isSelected?: boolean;
}

export const MarkerComponent: React.FC<MarkerComponentProps> = ({ item, onClick, isSelected }) => {
  return (
    <OverlayView
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      position={{
        lat: item?.lat,
        lng: item?.lng,
      }}
    >
      <>
      <div className={`absolute items-center justify-center flex cursor-pointer`} style={{color: getRandomDarkHexColor()}} onClick={onClick}>
        <TruckIcon />
      </div>
      {isSelected ? (
        <InfoWindow 
          position={{
            lat: item?.lat,
            lng: item?.lng,
          }}
          options={{
            headerDisabled: true,
            pixelOffset: new window.google.maps.Size(20, -10),
          }}
        >
          <div className="flex flex-col gap-1 p-1 w-48 items-center">
            <button className="absolute right-1.5 top-2 p-0.5 cursor-pointer" onClick={onClick}>
              <IconComponent iconName="IoMdClose" size={16}/>
            </button>
            <p className="font-medium text-xs">Placa {item?.plate}</p>
            <p className="font-medium text-xs">Frota {item?.fleet}</p>
            <p className="font-medium text-xs">{dayjs(item?.createdAt)?.format('DD/MM/YYYY [-] HH:mm')}</p>
            <a className="cursor-pointer" href={`https://www.google.com/maps/search/?api=1&query=${item?.lat},${item?.lng}`} target="_blank" rel="noreferrer">
              <p className="font-medium text-xs underline">{`${item?.lat}, ${item?.lng}`}</p>
            </a>
          </div>
        </InfoWindow>
      ) : null}
      </>
    </OverlayView>
  )
}

import { InfoWindow, OverlayView } from "@react-google-maps/api"
import { LocationVehicle } from "@/interfaces/vehicleInterfaces"
import dayjs from "dayjs";
import { IconComponent } from "../IconComponent";
import { getRandomDarkHexColor } from "@/utils/getRandomDarkHexColor";

interface MarkerComponentProps {
  item: LocationVehicle;
  onClick?: () => void;
  isSelected?: boolean;
}

export const MarkerComponent: React.FC<MarkerComponentProps> = ({ item, onClick, isSelected }) => {
  
  const bgColor = getRandomDarkHexColor();
  
  return (
    <OverlayView
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      position={{
        lat: item?.lat,
        lng: item?.lng,
      }}
    >
      <>
      <div
        onClick={onClick}
        className="relative w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: bgColor }}>
        <IconComponent iconName="RiTruckLine" size={24} color="#fff" />
        <div
          className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
          style={{ borderTopColor: bgColor }}
        />
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
          <div className="flex flex-row gap-1 w-full">
            <div>
              <p className="font-medium text-xs">Placa {item?.plate}</p>
              <p className="font-medium text-xs">Frota {item?.fleet}</p>
              <p className="font-medium text-xs">{dayjs(item?.createdAt)?.format('DD/MM/YYYY [-] HH:mm')}</p>
              <a className="cursor-pointer" href={`https://www.google.com/maps/search/?api=1&query=${item?.lat},${item?.lng}`} target="_blank" rel="noreferrer">
                <p className="font-medium text-xs underline">{`${item?.lat}, ${item?.lng}`}</p>
              </a>
            </div>
            <button className="flex justify-end cursor-pointer h-6 w-6" onClick={onClick}>
              <IconComponent iconName="IoMdClose" size={16}/>
            </button>
          </div>
        </InfoWindow>
      ) : null}
      </>
    </OverlayView>
  )
}

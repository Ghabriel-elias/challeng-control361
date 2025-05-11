import Skeleton from "react-loading-skeleton";
import { MarkerComponent } from "../MarkerComponent";
import { GoogleMap } from "@react-google-maps/api";
import { LocationVehicle } from "@/interfaces/vehicleInterfaces";

interface MapComponentProps {
  isLoaded: boolean;
  loading: boolean;
  vehiclesLocation: LocationVehicle[];
  map: google.maps.Map | null;
  onLoad: (map: google.maps.Map) => void;
  handleClickOnTruck: (item: LocationVehicle) => void;
  selectedVehicle: LocationVehicle | null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  isLoaded,
  vehiclesLocation,
  map,
  onLoad,
  handleClickOnTruck,
  selectedVehicle,
  loading,
}) => {
  return (
    <div className="mt-6 p-4 bg-blue-15 rounded-2xl border-blue-30 border-1">
      <p className="font-medium text-md">Mapa rastreador</p>
      {isLoaded && vehiclesLocation?.length ? (
        <GoogleMap
          mapContainerClassName="map-container"
          center={
            map?.getCenter() || {
              lat: Number(vehiclesLocation?.at(0)?.lat),
              lng: Number(vehiclesLocation?.at(0)?.lng),
            }
          }
          zoom={5}
          onLoad={onLoad}
        >
          {/* {vehiclesLocation?.map((item) => (
            <MarkerComponent
              key={item?.id + item?.lat + item?.lng}
              item={item}
              onClick={() => handleClickOnTruck(item)}
              isSelected={
                selectedVehicle?.id === item?.id &&
                selectedVehicle?.lat === item?.lat &&
                selectedVehicle?.lng === item?.lng
              } 
            />
          ))} */}
        </GoogleMap>
      ) : loading || !isLoaded ? (
        <Skeleton width={"100%"} className="map-container" />
      ) : null}
    </div>
  );
};
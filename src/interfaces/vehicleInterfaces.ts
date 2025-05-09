export interface Vehicle {
  id: string;
  plate: string;
  fleet: string | null;
  type: 'vehicle' | 'implement';
  model: string;
  nameOwner: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface LocationVehicle {
  id: string;
  fleet: string;
  equipmentId: string;
  name: string;
  plate: string;
  ignition: 'Ligado' | 'Desligado';
  lat: number;
  lng: number;
  createdAt: string;
}

export interface VehicleResponse {
  statusCode: number;
  message: string;
  content: {
    vehicles: Vehicle[];
    locationVehicles: LocationVehicle[];
    totalPages: number;
    page: number;
    perPage: string;
  };
}
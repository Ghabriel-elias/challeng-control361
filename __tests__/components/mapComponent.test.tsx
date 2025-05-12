import { screen } from '@testing-library/react';
import { MapComponent } from '@/components/MapComponent';
import { LocationVehicle } from '@/interfaces/vehicleInterfaces';
import { render } from '../test-utils';

jest.mock('@react-google-maps/api', () => ({
  GoogleMap: jest.fn(({ children }) => <div data-testid="google-map">{children}</div>),
}));

jest.mock('@/components/MarkerComponent', () => ({
  MarkerComponent: jest.fn(({ item }) => <div data-testid="marker">{item.id}</div>),
}));

describe('MapComponent', () => {
  const mockVehiclesLocation: LocationVehicle[] = [
    {
      id: '1', lat: 10, lng: 20, plate: 'XYZ789', fleet: 'Fleet1', createdAt: new Date()?.toString(),
      equipmentId: '',
      name: '',
      ignition: 'Ligado'
    },
    {
      id: '2', lat: 30, lng: 40, plate: 'ABC123', fleet: 'Fleet1', createdAt: new Date()?.toString(),
      equipmentId: '',
      name: '',
      ignition: 'Ligado'
    },
  ];

  const mockOnLoad = jest.fn();
  const mockHandleClickOnTruck = jest.fn();

  it('renders the GoogleMap when isLoaded is true', () => {
    render(
      <MapComponent
        isLoaded={true}
        loading={false}
        vehiclesLocation={mockVehiclesLocation}
        map={null}
        onLoad={mockOnLoad}
        handleClickOnTruck={mockHandleClickOnTruck}
        selectedVehicle={null}
      />
    );

    const googleMap = screen.getByTestId('google-map');
    expect(googleMap).toBeInTheDocument();
  });

  it('renders markers for each vehicle location', () => {
    render(
      <MapComponent
        isLoaded={true}
        loading={false}
        vehiclesLocation={mockVehiclesLocation}
        map={null}
        onLoad={mockOnLoad}
        handleClickOnTruck={mockHandleClickOnTruck}
        selectedVehicle={null}
      />
    );

    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(mockVehiclesLocation.length);
  });
  it('renders a skeleton when loading is true', () => {
    render(
      <MapComponent
        isLoaded={false}
        loading={true}
        vehiclesLocation={[]}
        map={null}
        onLoad={mockOnLoad}
        handleClickOnTruck={mockHandleClickOnTruck}
        selectedVehicle={null}
      />
    );

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
  });
  it('does not render anything when not loaded and not loading', () => {
    render(
      <MapComponent
        isLoaded={false}
        loading={false}
        vehiclesLocation={[]}
        map={null}
        onLoad={mockOnLoad}
        handleClickOnTruck={mockHandleClickOnTruck}
        selectedVehicle={null}
      />
    );

    const googleMap = screen.queryByTestId('google-map');
    const skeleton = screen.queryByText(/Mapa rastreador/).nextSibling;
    expect(googleMap).not.toBeInTheDocument();
    expect(skeleton).not.toBeInTheDocument();
  });
});
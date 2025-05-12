import { screen, fireEvent } from '@testing-library/react';
import { MarkerComponent } from '@/components/MarkerComponent';
import { LocationVehicle } from '@/interfaces/vehicleInterfaces';
import { render } from '../../__mocks__/test-utils';

jest.mock('@react-google-maps/api', () => ({
  OverlayView: jest.fn(({ children }) => <div data-testid="overlay-view">{children}</div>),
  InfoWindow: jest.fn(({ children }) => <div data-testid="info-window">{children}</div>),
}));

jest.mock('@/components/IconComponent', () => ({
  IconComponent: jest.fn(({ iconName }) => <div data-testid={`icon-${iconName}`} />),
}));

beforeAll(() => {
  global.window.google = {
    maps: {
      Size: jest.fn().mockImplementation((width, height) => ({ width, height })),
    },
  } as any;
});

describe('MarkerComponent', () => {
  const mockItem: LocationVehicle = {
    id: '1',
    lat: 10,
    lng: 20,
    plate: 'ABC-1234',
    fleet: 'Fleet 1',
    createdAt: '2023-01-01T12:00:00Z',
    equipmentId: '',
    name: '',
    ignition: 'Ligado',
  };

  const mockOnClick = jest.fn();

  it('renders the marker with the correct position', () => {
    render(<MarkerComponent item={mockItem} />);
    const overlayView = screen.getByTestId('overlay-view');
    expect(overlayView).toBeInTheDocument();
  });

  it('renders the InfoWindow when isSelected is true', () => {
    render(<MarkerComponent item={mockItem} isSelected={true} />);
    const infoWindow = screen.getByTestId('info-window');
    expect(infoWindow).toBeInTheDocument();
  });

  it('does not render the InfoWindow when isSelected is false', () => {
    render(<MarkerComponent item={mockItem} isSelected={false} />);
    const infoWindow = screen.queryByTestId('info-window');
    expect(infoWindow).not.toBeInTheDocument();
  });

  it('calls onClick when the marker is clicked', () => {
    render(<MarkerComponent item={mockItem} onClick={mockOnClick} />);
    const marker = screen.getByTestId('overlay-view').firstChild;
    fireEvent.click(marker as HTMLElement);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('renders the correct icon for the marker', () => {
    render(<MarkerComponent item={mockItem} />);
    const icon = screen.getByTestId('icon-RiTruckLine');
    expect(icon).toBeInTheDocument();
  });

  it('renders the correct details in the InfoWindow', () => {
    render(<MarkerComponent item={mockItem} isSelected={true} />);

    const plate = screen.getByText(/Placa ABC-1234/);
    const fleet = screen.getByText(/Frota Fleet 1/);
    const dates = screen.getAllByText((_content: string, element: Element | null) => {
      return !!(element as HTMLElement)?.textContent?.includes('01/01/2023 - 08:00');
    });
    
    expect(plate).toBeInTheDocument();
    expect(fleet).toBeInTheDocument();
    expect(dates.length).toBeGreaterThan(0); 
  });

  it('renders a close button in the InfoWindow and calls onClick when clicked', () => {
    render(<MarkerComponent item={mockItem} isSelected={true} onClick={mockOnClick} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
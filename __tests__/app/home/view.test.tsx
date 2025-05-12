import { useHomeModel } from '@/app/(home)/model';
import { HomeView } from '@/app/(home)/view';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../test-utils';

const mockProps: ReturnType<typeof useHomeModel> = {
  filterType: "tracked" as "tracked" | "others",
  isFocused: false,
  setIsFocuses: jest.fn(),
  handleInput: jest.fn(),
  data: { 
    vehicles: [], 
    locationVehicles: [], 
    totalPages: 0, 
    page: 1, 
    perPage: "10" 
  },
  tableRef: { current: null },
  handleScroll: jest.fn(),
  page: 1,
  handleClickOnTruck: jest.fn(),
  isLoaded: true,
  map: null,
  onLoad: jest.fn(),
  selectedVehicle: null,
  isFetching: false,
  handleRadio: jest.fn(),
  vehicles: [
    {
      id: '1', plate: 'ABC1234', fleet: 'Fleet1', type: 'vehicle', model: 'Model1', status: 'active',
      nameOwner: '',
      createdAt: ''
    },
    {
      id: '2', plate: 'XYZ5678', fleet: 'Fleet2', type: 'implement', model: 'Model2', status: 'inactive',
      nameOwner: '',
      createdAt: ''
    },
  ],
  inputValue: '',
  startPoolingMap: jest.fn(),
};


jest.mock('@react-google-maps/api', () => ({
  GoogleMap: jest.fn(({ children }) => <div data-testid="google-map">{children}</div>),
}));

beforeAll(() => {
  global.google = {
    maps: {
      Map: jest.fn(() => ({
        setCenter: jest.fn(),
        setZoom: jest.fn(),
      })),
      Marker: jest.fn(),
      InfoWindow: jest.fn(),
      LatLng: jest.fn(),
      LatLngBounds: jest.fn(),
      Point: jest.fn(),
      Size: jest.fn(),
      ControlPosition: {},
      MapTypeId: {},
      DirectionsRenderer: jest.fn(),
      DirectionsService: jest.fn(),
    },
  };
});

describe('HomeView', () => {
  it('renders the component correctly', () => {
    render(<HomeView {...mockProps} />);

    expect(screen.getByText('Ghabriel Elias')).toBeInTheDocument();
    expect(screen.getByText('Lista')).toBeInTheDocument();
    expect(screen.getByText('Rastreados')).toBeInTheDocument();
    expect(screen.getByText('Outros')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por placa ou frota')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('renders the vehicles list correctly', () => {
    render(<HomeView {...mockProps} />);

    expect(screen.getByText('ABC1234')).toBeInTheDocument();
    expect(screen.getByText('Fleet1')).toBeInTheDocument();
    expect(screen.getByText('Motor')).toBeInTheDocument();
    expect(screen.getByText('Model1')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();

    expect(screen.getByText('XYZ5678')).toBeInTheDocument();
    expect(screen.getByText('Fleet2')).toBeInTheDocument();
    expect(screen.getByText('Implemento')).toBeInTheDocument();
    expect(screen.getByText('Model2')).toBeInTheDocument();
    expect(screen.getByText('Inativo')).toBeInTheDocument();
  });

  it('calls handleRadio when radio buttons are clicked', () => {
    render(<HomeView {...mockProps} />);

    const trackedRadio = screen.getByText('Rastreados');
    const othersRadio = screen.getByText('Outros');

    fireEvent.click(trackedRadio);
    expect(mockProps.handleRadio).toHaveBeenCalledWith('tracked');

    fireEvent.click(othersRadio);
    expect(mockProps.handleRadio).toHaveBeenCalledWith('others');
  });

  it('calls handleInput when input value changes', () => {
    render(<HomeView {...mockProps} />);

    const input = screen.getByPlaceholderText('Buscar por placa ou frota');
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(mockProps.handleInput).toHaveBeenCalledWith('Test');
  });

  it('calls setIsFocuses on input focus and blur', () => {
    render(<HomeView {...mockProps} />);

    const input = screen.getByPlaceholderText('Buscar por placa ou frota');
    fireEvent.focus(input);
    expect(mockProps.setIsFocuses).toHaveBeenCalledWith(true);

    fireEvent.blur(input);
    expect(mockProps.setIsFocuses).toHaveBeenCalledWith(false);
  });

  it('renders loading skeletons when isFetching is true', () => {
    render(<HomeView {...mockProps} isFetching={true} vehicles={[]} />);

    expect(screen.getAllByTestId('table-cell-loading').length).toBeGreaterThan(0);
  });

  it('renders no vehicles message when vehicles list is empty', () => {
    render(<HomeView {...mockProps} vehicles={[]} inputValue="Test" isFetching={false} />);

    expect(screen.getByText('Nenhum veículo encontrado para esses parâmetros')).toBeInTheDocument();
  });

  it('renders the correct message when no vehicles are available and input is empty', () => {
    render(<HomeView {...mockProps} vehicles={[]} inputValue="" isFetching={false} />);

    expect(screen.getByText('Sem veículos para exibir')).toBeInTheDocument();
  });

  it('renders the correct message when no vehicles are available for the given input', () => {
    render(<HomeView {...mockProps} vehicles={[]} inputValue="Test" isFetching={false} />);

    expect(screen.getByText('Nenhum veículo encontrado para esses parâmetros')).toBeInTheDocument();
  });

  it('renders the map component correctly when isLoaded is true', () => {
    render(<HomeView {...mockProps} isLoaded={true} />);

    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  it('does not render the map component when isLoaded is false', () => {
    render(<HomeView {...mockProps} isLoaded={false} />);

    expect(screen.queryByTestId('google-map')).not.toBeInTheDocument();
  });
  
  it('calls startPoolingMap on mount', () => {
    render(<HomeView {...mockProps} />);

    expect(mockProps.startPoolingMap).toHaveBeenCalled();
  });
});
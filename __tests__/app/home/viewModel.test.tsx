import { render, screen } from '@testing-library/react';
import Home from '@/app/(home)/viewModel';
import { useHomeModel } from '@/app/(home)/model';

jest.mock('@/app/(home)/model', () => ({
  useHomeModel: jest.fn(),
}));

jest.mock('@/app/(home)/view', () => ({
  HomeView: jest.fn(() => <div data-testid="home-view">HomeView Component</div>),
}));

describe('Home', () => {
  it('renders the HomeView component with methods from useHomeModel', () => {
    const mockMethods = {
      filterType: 'tracked',
      isFocused: false,
      setIsFocuses: jest.fn(),
      handleInput: jest.fn(),
      data: { vehicles: [], locationVehicles: [], totalPages: 0 },
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
      vehicles: [],
      inputValue: '',
      startPoolingMap: jest.fn(),
    };
    (useHomeModel as jest.Mock).mockReturnValue(mockMethods);

    render(<Home />);

    expect(screen.getByTestId('home-view')).toBeInTheDocument();

    expect(useHomeModel).toHaveBeenCalled();
  });
});
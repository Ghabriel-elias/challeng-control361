import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';
import { useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import { useHomeModel } from '@/app/(home)/model';
import { LocationVehicle } from '@/interfaces/vehicleInterfaces';

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: jest.fn(),
}));

jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.useFakeTimers();

describe('useHomeModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default states', () => {
    (useJsApiLoader as jest.Mock).mockReturnValue({ isLoaded: true });
    (useQuery as jest.Mock).mockReturnValue({ data: null, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());

    expect(result.current.filterType).toBe('tracked');
    expect(result.current.isFocused).toBe(false);
    expect(result.current.page).toBe(1);
    expect(result.current.vehicles).toEqual([]);
    expect(result.current.inputValue).toBe('');
  });

  it('handles input changes correctly', () => {
    const debounceMock = jest.fn((callback) => callback());
    (useDebounce as jest.Mock).mockReturnValue(debounceMock);
    (useQuery as jest.Mock).mockReturnValue({ data: null, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());

    act(() => {
      result.current.handleInput('test');
    });

    expect(result.current.inputValue).toBe('test');
    expect(result.current.page).toBe(1);
    expect(result.current.vehicles).toEqual([]);
    expect(debounceMock).toHaveBeenCalled();
  });

  it('handles radio button changes correctly', () => {
    (useQuery as jest.Mock).mockReturnValue({ data: null, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());

    act(() => {
      result.current.handleRadio('others');
    });

    expect(result.current.filterType).toBe('others');
    expect(result.current.page).toBe(1);
    expect(result.current.vehicles).toEqual([]);
  });

  it('handles truck click correctly', () => {
    const mockMap = {
      setZoom: jest.fn(),
      setCenter: jest.fn(),
    };
    (useJsApiLoader as jest.Mock).mockReturnValue({ isLoaded: true });
    (useQuery as jest.Mock).mockReturnValue({ data: null, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());

    act(() => {
      result.current.onLoad(mockMap as unknown as google.maps.Map);
    });

    const mockVehicle = { lat: '10', lng: '20' };
    act(() => {
      result.current.handleClickOnTruck(mockVehicle as unknown as LocationVehicle);
    });

    expect(result.current.selectedVehicle).toEqual(mockVehicle);
    expect(mockMap.setZoom).toHaveBeenCalledWith(15);
    expect(mockMap.setCenter).toHaveBeenCalledWith({ lat: 10, lng: 20 });
  });

  it('handles scroll correctly', () => {
    const mockRef = {
      current: {
        scrollTop: 100,
        scrollHeight: 300,
        clientHeight: 200,
      },
    };
    (useQuery as jest.Mock).mockReturnValue({ data: { totalPages: 2 }, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());
    result.current.tableRef.current = mockRef.current as unknown as HTMLDivElement;

    act(() => {
      result.current.handleScroll();
    });

    expect(result.current.page).toBe(2);
  });

  it('handles focus state correctly', () => {
    const { result } = renderHook(() => useHomeModel());

    act(() => {
      result.current.setIsFocuses(true);
    });

    expect(result.current.isFocused).toBe(true);

    act(() => {
      result.current.setIsFocuses(false);
    });

    expect(result.current.isFocused).toBe(false);
  });

  it('clears selected vehicle when clicking the same truck', () => {
    const mockVehicle = { lat: '10', lng: '20' };
    const { result } = renderHook(() => useHomeModel());

    act(() => {
      result.current.handleClickOnTruck(mockVehicle as unknown as LocationVehicle);
    });

    expect(result.current.selectedVehicle).toEqual(mockVehicle);

    act(() => {
      result.current.handleClickOnTruck(mockVehicle as unknown as LocationVehicle);
    });

    expect(result.current.selectedVehicle).toBe(null);
  });

  it('does not increment page when at the last page', () => {
    const mockRef = {
      current: {
        scrollTop: 100,
        scrollHeight: 300,
        clientHeight: 200,
      },
    };
    (useQuery as jest.Mock).mockReturnValue({ data: { totalPages: 1 }, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());
    result.current.tableRef.current = mockRef.current as unknown as HTMLDivElement;

    act(() => {
      result.current.handleScroll();
    });

    expect(result.current.page).toBe(1);
  });

  it('does not fetch vehicles when API key is missing', () => {
    (useJsApiLoader as jest.Mock).mockReturnValue({ isLoaded: false });
    (useQuery as jest.Mock).mockReturnValue({ data: null, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());

    expect(result.current.isLoaded).toBe(false);
  });

  it('clears vehicles and resets page when input value changes', () => {
    const debounceMock = jest.fn((callback) => callback());
    (useDebounce as jest.Mock).mockReturnValue(debounceMock);
    (useQuery as jest.Mock).mockReturnValue({ data: null, isFetching: false, refetch: jest.fn() });

    const { result } = renderHook(() => useHomeModel());

    act(() => {
      result.current.handleInput('new input');
    });

    expect(result.current.inputValue).toBe('new input');
    expect(result.current.page).toBe(1);
    expect(result.current.vehicles).toEqual([]);
  });

  it('starts pooling map correctly', () => {
    const refetchMock = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({ data: null, isFetching: false, refetch: refetchMock });

    const { result } = renderHook(() => useHomeModel());

    act(() => {
      result.current.startPoolingMap();
    });

    jest.advanceTimersByTime(1000 * 60 * 2);

    expect(refetchMock).toHaveBeenCalled();
  });
});
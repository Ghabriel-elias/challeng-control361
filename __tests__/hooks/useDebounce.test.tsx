import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('calls the callback after the specified delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(1000));

    act(() => {
      result.current(callback);
    });

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('resets the timer if called again before the delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(1000));

    act(() => {
      result.current(callback);
      jest.advanceTimersByTime(500); 
      result.current(callback);
    });

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1); 
  });

  it('does not call the callback if unmounted before the delay', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useDebounce(1000));

    act(() => {
      result.current(callback);
      unmount(); 
    });

    jest.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });
});
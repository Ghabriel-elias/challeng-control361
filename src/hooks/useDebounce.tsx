import { useRef } from 'react';

export function useDebounce(delay = 1000) {
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  function debounceFn(callback: () => void) {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(() => {
      callback();
    }, delay);
  }

  return debounceFn;
}

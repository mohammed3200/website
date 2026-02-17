import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = window.matchMedia(query);

    // Initial value
    setValue(result.matches);

    // Modern browsers
    if (typeof result.addEventListener === 'function') {
      result.addEventListener('change', onChange);
      return () => result.removeEventListener('change', onChange);
    }

    // Older browsers (Safari < 14)
    if (typeof result.addListener === 'function') {
      result.addListener(onChange);
      return () => result.removeListener(onChange);
    }
  }, [query]);

  return value;
}

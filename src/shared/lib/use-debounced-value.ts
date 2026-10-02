"use client";

import { useEffect, useState } from "react";

/** `value` once it has stopped changing for `delay` ms, e.g. to announce search results after typing pauses. */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

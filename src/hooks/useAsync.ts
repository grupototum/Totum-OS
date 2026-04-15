import { useEffect, useState } from 'react';

interface UseAsyncState<T> {
  isLoading: boolean;
  data: T | null;
  error: Error | null;
}

/**
 * Hook for handling async operations with loading and error states
 * Useful for data fetching with automatic cleanup
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncState<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    isLoading: immediate,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!immediate) return;

    let isMounted = true;

    const execute = async () => {
      try {
        const response = await asyncFunction();
        if (isMounted) {
          setState({
            isLoading: false,
            data: response,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            isLoading: false,
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, [asyncFunction, immediate]);

  return state;
}

import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook for managing async operation loading states
 * Useful for data fetching, API calls, etc.
 */
export function useLoadingState(initialLoading = false) {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  const setSuccess = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    reset,
    setSuccess,
  };
}

import { useEffect, useRef, useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Wraps an async fetcher function with loading/error/data state.
 * Re-runs whenever `deps` changes. Exposes `refetch` for manual re-triggers
 * (e.g. after a mutation like submitting a leave request).
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const mountedRef = useRef(true);

  const run = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fetcher()
      .then((data) => {
        if (mountedRef.current) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (mountedRef.current)
          setState({ data: null, loading: false, error: err?.message ?? "Something went wrong" });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}

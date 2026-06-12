import { useState, useEffect } from 'react';

interface DataState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Simple request cache across component mounts
const cache = new Map<string, unknown>();

export function useData<T>(filename: string, autoUnwrap = false): DataState<T> {
  const [state, setState] = useState<DataState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const cacheKey = `${filename}.json`;
    const cached = cache.get(cacheKey);

    if (cached) {
      setState({ data: cached as T, error: null, loading: false });
      return;
    }

    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}data/${filename}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
        let result: unknown = json;
        // Only auto-unwrap when explicitly requested
        if (autoUnwrap) {
          const keys = Object.keys(json);
          if (keys.length === 1 && keys[0] !== undefined) {
            result = json[keys[0]];
          }
        }
        cache.set(cacheKey, result);
        setState({ data: result as T, error: null, loading: false });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`Failed to load ${filename}.json:`, err);
        setState({ data: null, error: `加载「${filename}」数据失败，请检查网络连接`, loading: false });
      });

    return () => { cancelled = true; };
  }, [filename]);

  return state;
}

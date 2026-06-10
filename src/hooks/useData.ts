import { useState, useEffect } from 'react';

interface DataState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useData<T>(filename: string): DataState<T> {
  const [state, setState] = useState<DataState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`/bioml-guide/data/${filename}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
        const keys = Object.keys(json);
        // If the JSON has a single key and its value is an array, return the array directly
        if (keys.length === 1 && keys[0] !== undefined) {
          setState({ data: json[keys[0]] as T, error: null, loading: false });
        } else {
          // Multi-key object (e.g. resources with categories, levels, costs, resources)
          setState({ data: json as T, error: null, loading: false });
        }
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

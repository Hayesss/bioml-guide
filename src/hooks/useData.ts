import { useState, useEffect } from 'react';

export function useData<T>(filename: string): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(`/bioml-guide/data/${filename}.json`)
      .then((r) => r.json())
      .then((json) => {
        const keys = Object.keys(json);
        // If the JSON has a single key and its value is an array, return the array directly
        if (keys.length === 1) {
          setData(json[keys[0]] as T);
        } else {
          // Multi-key object (e.g. resources with categories, levels, costs, resources)
          setData(json as T);
        }
      })
      .catch((err) => {
        console.error(`Failed to load ${filename}.json:`, err);
      });
  }, [filename]);

  return data;
}

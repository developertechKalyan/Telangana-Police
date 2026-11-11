import { useEffect, useRef, useState } from "react";
import { fetchWeather, type WeatherPayload } from "@/lib/weatherApi";

interface WeatherState {
  data: WeatherPayload | null;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({ data: null, loading: true, error: null });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchWeather();
        if (cancelled) return;
        setState({ data, loading: false, error: null });
        if (intervalRef.current === null) {
          const ms = Math.max(data.station.refreshIntervalMinutes, 1) * 60 * 1000;
          intervalRef.current = setInterval(load, ms);
        }
      } catch (err) {
        if (cancelled) return;
        setState((s) => ({ data: s.data, loading: false, error: err instanceof Error ? err.message : "Failed to load weather data" }));
      }
    }

    load();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return state;
}

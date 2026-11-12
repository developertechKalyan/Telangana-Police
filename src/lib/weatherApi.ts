import type { WeatherCondition } from "@/types/content";

export interface WeatherStation {
  deviceId: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  refreshIntervalMinutes: number;
}

export interface PollutantStatus {
  o3: "Normal" | "Elevated";
  co: "Normal" | "Elevated";
  pm10: "Normal" | "Elevated";
  pm25: "Normal" | "Elevated";
}

export interface LiveReading {
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  todayHigh: number;
  todayLow: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  rainChance: number;
  precipitation: number;
  pressure: number;
  solarRadiation: number;
  pm10: number;
  pm25: number;
  co: number;
  so2: number;
  o3: number;
  no2: number;
  aqi: number;
  pollutantStatus: PollutantStatus;
  updatedAt: string;
}

export interface LiveHourlyReading {
  hour: string;
  temp: number;
  humidity: number;
  condition: WeatherCondition;
}

export interface LiveDailyReading {
  day: string;
  high: number;
  low: number;
  condition: WeatherCondition;
}

export interface WeatherPayload {
  station: WeatherStation;
  current: LiveReading;
  hourly: LiveHourlyReading[];
  daily: LiveDailyReading[];
}

// Same as api.ts: localhost only in development, never on the live site.
const API_BASE =
  import.meta.env.VITE_WEATHER_API_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");

export async function fetchWeather(): Promise<WeatherPayload> {
  const res = await fetch(`${API_BASE}/api/weather`);
  if (!res.ok) {
    throw new Error(`Weather API responded with ${res.status}`);
  }
  return res.json();
}
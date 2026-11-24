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

import { API_BASE } from "@/lib/apiBase";

// Weather is served by the same Node API as login and gallery (backend/src/routes/weatherRoutes.ts).
export async function fetchWeather(): Promise<WeatherPayload> {
  const res = await fetch(`${API_BASE}/weather`);
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  if (!res.ok || !isJson) {
    throw new Error("Live weather data is not available right now.");
  }
  return res.json();
}

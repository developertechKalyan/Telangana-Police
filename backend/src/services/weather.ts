/**
 * Live weather + air quality for the TGiCCC station, from Open-Meteo (free, no API key).
 * Ported from the former Python service (backend/main.py + weather_service.py) so the whole API
 * runs as one Node server on one port. The response shape matches src/lib/weatherApi.ts.
 */

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export const STATION = {
  deviceId: process.env.WEATHER_DEVICE_ID || "WMS10042226",
  location: process.env.WEATHER_LOCATION || "TGiCCC — Telangana Integrated Command and Control Centre, Hyderabad",
  latitude: Number(process.env.WEATHER_LAT || 17.4147275),
  longitude: Number(process.env.WEATHER_LON || 78.427625),
  timezone: process.env.WEATHER_TZ || "Asia/Kolkata",
  refreshIntervalMinutes: Number(process.env.WEATHER_REFRESH_MINUTES || 5),
};

/** Hours of trailing history for the "recent readings" strip / trend chart. */
const HOURLY_WINDOW = 13;
/** Days of daily history (including today) for the 7-day panel. */
const DAILY_WINDOW = 7;
const UPSTREAM_TIMEOUT_MS = 10_000;

type Condition = "Sunny" | "Partly Cloudy" | "Cloudy" | "Rain";
type Status = "Normal" | "Elevated";

/** Maps a WMO weather code (Open-Meteo `weather_code`) to the site's condition set. */
function conditionFromWmo(code: number): Condition {
  if (code === 0 || code === 1) return "Sunny";
  if (code === 2) return "Partly Cloudy";
  if (code === 3 || code === 45 || code === 48) return "Cloudy";
  return "Rain"; // drizzle / rain / showers / thunderstorms / snow
}

function pollutantStatus(subIndex: number | null | undefined): Status {
  return typeof subIndex === "number" && subIndex > 50 ? "Elevated" : "Normal";
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Open-Meteo returns local times like "2026-11-13T16:45" (already in the station's timezone). */
function parts(local: string) {
  const [date, time = "00:00"] = local.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return { y, m, d, hh, mm, date };
}

function hourLabel(local: string): string {
  const { hh } = parts(local);
  return `${hh % 12 === 0 ? 12 : hh % 12} ${hh < 12 ? "AM" : "PM"}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function updatedAtLabel(local: string): string {
  const { y, m, d, hh, mm } = parts(local);
  const h12 = String(hh % 12 === 0 ? 12 : hh % 12).padStart(2, "0");
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}, ${h12}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
}

function weekday(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

async function getJson(url: string, params: Record<string, string | number>): Promise<any> {
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const res = await fetch(`${url}?${qs}`, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Open-Meteo responded with ${res.status}`);
  return res.json();
}

function fetchForecast() {
  return getJson(FORECAST_URL, {
    latitude: STATION.latitude,
    longitude: STATION.longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "surface_pressure",
      "wind_speed_10m",
      "wind_direction_10m",
      "shortwave_radiation",
    ].join(","),
    hourly: "temperature_2m,relative_humidity_2m,weather_code,precipitation_probability",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    timezone: STATION.timezone,
    past_days: DAILY_WINDOW - 1,
    forecast_days: 1,
  });
}

function fetchAirQuality() {
  return getJson(AIR_QUALITY_URL, {
    latitude: STATION.latitude,
    longitude: STATION.longitude,
    current: [
      "pm10",
      "pm2_5",
      "carbon_monoxide",
      "sulphur_dioxide",
      "ozone",
      "nitrogen_dioxide",
      "us_aqi",
      "us_aqi_pm2_5",
      "us_aqi_pm10",
      "us_aqi_ozone",
      "us_aqi_carbon_monoxide",
      "us_aqi_sulphur_dioxide",
    ].join(","),
    timezone: STATION.timezone,
  });
}

export function buildPayload(forecast: any, air: any) {
  const current = forecast.current;
  const hourly = forecast.hourly;
  const daily = forecast.daily;
  const airNow = air.current;

  // `current.time` is in 15-minute steps (e.g. 16:45) but the hourly list has whole hours only,
  // so match on the hour. (The Python version matched the exact string, missed, and fell back to 23:00.)
  const hourlyTimes: string[] = hourly.time;
  const currentHour = `${String(current.time).slice(0, 13)}:00`;
  let nowIdx = hourlyTimes.indexOf(currentHour);
  if (nowIdx === -1) nowIdx = hourlyTimes.length - 1;

  const probabilities: (number | null)[] = hourly.precipitation_probability ?? [];
  const rainChance = probabilities[nowIdx] ?? 0;

  const todayStr = parts(current.time).date;
  const dailyTimes: string[] = daily.time;
  let todayIdx = dailyTimes.indexOf(todayStr);
  if (todayIdx === -1) todayIdx = dailyTimes.length - 1;

  const start = Math.max(0, nowIdx - (HOURLY_WINDOW - 1));
  const hourlyOut = [];
  for (let i = start; i <= nowIdx; i++) {
    hourlyOut.push({
      hour: hourLabel(hourlyTimes[i]),
      temp: hourly.temperature_2m[i],
      humidity: hourly.relative_humidity_2m[i],
      condition: conditionFromWmo(hourly.weather_code[i]),
    });
  }

  const dailyOut = [];
  for (let i = dailyTimes.length - 1; i >= 0; i--) {
    dailyOut.push({
      day: dailyTimes[i] === todayStr ? "Today" : weekday(dailyTimes[i]),
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      condition: conditionFromWmo(daily.weather_code[i]),
    });
  }

  return {
    station: STATION,
    current: {
      temperature: current.temperature_2m,
      feelsLike: Math.round(current.apparent_temperature),
      condition: conditionFromWmo(current.weather_code),
      todayHigh: Math.round(daily.temperature_2m_max[todayIdx]),
      todayLow: Math.round(daily.temperature_2m_min[todayIdx]),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      rainChance,
      precipitation: current.precipitation,
      pressure: current.surface_pressure,
      solarRadiation: current.shortwave_radiation,
      pm10: round1(airNow.pm10),
      pm25: round1(airNow.pm2_5),
      co: round1(airNow.carbon_monoxide),
      so2: round1(airNow.sulphur_dioxide),
      o3: round1(airNow.ozone),
      no2: round1(airNow.nitrogen_dioxide),
      aqi: airNow.us_aqi,
      pollutantStatus: {
        o3: pollutantStatus(airNow.us_aqi_ozone),
        co: pollutantStatus(airNow.us_aqi_carbon_monoxide),
        pm10: pollutantStatus(airNow.us_aqi_pm10),
        pm25: pollutantStatus(airNow.us_aqi_pm2_5),
      },
      updatedAt: updatedAtLabel(current.time),
    },
    hourly: hourlyOut,
    daily: dailyOut,
  };
}

let cache: { payload: ReturnType<typeof buildPayload>; fetchedAt: number } | null = null;
let inFlight: Promise<ReturnType<typeof buildPayload>> | null = null;

/**
 * Cached for `refreshIntervalMinutes`. If Open-Meteo fails, the last good reading is served;
 * only when there is none does the error reach the caller.
 */
export async function getWeather() {
  const ttl = Math.max(STATION.refreshIntervalMinutes, 1) * 60_000;
  if (cache && Date.now() - cache.fetchedAt < ttl) return cache.payload;
  if (inFlight) return inFlight; // one upstream request at a time

  inFlight = (async () => {
    try {
      const [forecast, air] = await Promise.all([fetchForecast(), fetchAirQuality()]);
      const payload = buildPayload(forecast, air);
      cache = { payload, fetchedAt: Date.now() };
      return payload;
    } catch (error) {
      if (cache) return cache.payload;
      throw error;
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

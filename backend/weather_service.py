import os
from datetime import datetime
from typing import Any

import httpx

FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

STATION = {
    "deviceId": os.environ.get("WEATHER_DEVICE_ID", "WMS10042226"),
    "location": os.environ.get("WEATHER_LOCATION", "TGiCCC — Telangana Integrated Command and Control Centre, Hyderabad"),
    "latitude": float(os.environ.get("WEATHER_LAT", "17.4147275")),
    "longitude": float(os.environ.get("WEATHER_LON", "78.427625")),
    "timezone": os.environ.get("WEATHER_TZ", "Asia/Kolkata"),
    "refreshIntervalMinutes": int(os.environ.get("WEATHER_REFRESH_MINUTES", "5")),
}

# Hours of trailing history to expose in the "recent readings" strip / trend chart.
HOURLY_WINDOW = 13
# Days of daily history to expose (including today) in the 7-day panel.
DAILY_WINDOW = 7


def condition_from_wmo(code: int) -> str:
    """Maps a WMO weather code (Open-Meteo's `weather_code`) to the app's condition set."""
    if code in (0, 1):
        return "Sunny"
    if code == 2:
        return "Partly Cloudy"
    if code in (3, 45, 48):
        return "Cloudy"
    return "Rain"  # drizzle / rain / showers / thunderstorms / snow


def format_hour_label(dt: datetime) -> str:
    hour12 = dt.strftime("%I").lstrip("0") or "12"
    return f"{hour12} {dt.strftime('%p')}"


def pollutant_status(us_aqi_subindex: float | None) -> str:
    if us_aqi_subindex is None:
        return "Normal"
    return "Elevated" if us_aqi_subindex > 50 else "Normal"


async def fetch_forecast(client: httpx.AsyncClient) -> dict[str, Any]:
    params = {
        "latitude": STATION["latitude"],
        "longitude": STATION["longitude"],
        "current": ",".join(
            [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "weather_code",
                "surface_pressure",
                "wind_speed_10m",
                "wind_direction_10m",
                "shortwave_radiation",
            ]
        ),
        "hourly": "temperature_2m,relative_humidity_2m,weather_code,precipitation_probability",
        "daily": "temperature_2m_max,temperature_2m_min,weather_code",
        "timezone": STATION["timezone"],
        "past_days": DAILY_WINDOW - 1,
        "forecast_days": 1,
    }
    resp = await client.get(FORECAST_URL, params=params)
    resp.raise_for_status()
    return resp.json()


async def fetch_air_quality(client: httpx.AsyncClient) -> dict[str, Any]:
    params = {
        "latitude": STATION["latitude"],
        "longitude": STATION["longitude"],
        "current": ",".join(
            [
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
            ]
        ),
        "timezone": STATION["timezone"],
    }
    resp = await client.get(AIR_QUALITY_URL, params=params)
    resp.raise_for_status()
    return resp.json()


def build_payload(forecast: dict[str, Any], air: dict[str, Any]) -> dict[str, Any]:
    current = forecast["current"]
    hourly = forecast["hourly"]
    daily = forecast["daily"]
    air_current = air["current"]

    now_dt = datetime.fromisoformat(current["time"])

    hourly_times: list[str] = hourly["time"]
    try:
        now_idx = hourly_times.index(current["time"])
    except ValueError:
        now_idx = len(hourly_times) - 1

    probabilities = hourly.get("precipitation_probability") or []
    rain_chance = probabilities[now_idx] if now_idx < len(probabilities) and probabilities[now_idx] is not None else 0

    today_high = daily["temperature_2m_max"][-1]
    today_low = daily["temperature_2m_min"][-1]

    current_out = {
        "temperature": current["temperature_2m"],
        "feelsLike": round(current["apparent_temperature"]),
        "condition": condition_from_wmo(current["weather_code"]),
        "todayHigh": round(today_high),
        "todayLow": round(today_low),
        "humidity": current["relative_humidity_2m"],
        "windSpeed": current["wind_speed_10m"],
        "windDirection": current["wind_direction_10m"],
        "rainChance": rain_chance,
        "precipitation": current["precipitation"],
        "pressure": current["surface_pressure"],
        "solarRadiation": current["shortwave_radiation"],
        "pm10": round(air_current["pm10"], 1),
        "pm25": round(air_current["pm2_5"], 1),
        "co": round(air_current["carbon_monoxide"], 1),
        "so2": round(air_current["sulphur_dioxide"], 1),
        "o3": round(air_current["ozone"], 1),
        "no2": round(air_current["nitrogen_dioxide"], 1),
        "aqi": air_current["us_aqi"],
        "pollutantStatus": {
            "o3": pollutant_status(air_current.get("us_aqi_ozone")),
            "co": pollutant_status(air_current.get("us_aqi_carbon_monoxide")),
            "pm10": pollutant_status(air_current.get("us_aqi_pm10")),
            "pm25": pollutant_status(air_current.get("us_aqi_pm2_5")),
        },
        "updatedAt": now_dt.strftime("%d %b %Y, %I:%M %p"),
    }

    start = max(0, now_idx - (HOURLY_WINDOW - 1))
    hourly_out = []
    for i in range(start, now_idx + 1):
        dt = datetime.fromisoformat(hourly_times[i])
        hourly_out.append(
            {
                "hour": format_hour_label(dt),
                "temp": hourly["temperature_2m"][i],
                "humidity": hourly["relative_humidity_2m"][i],
                "condition": condition_from_wmo(hourly["weather_code"][i]),
            }
        )

    daily_times: list[str] = daily["time"]
    today_str = now_dt.strftime("%Y-%m-%d")
    daily_out = []
    for i in range(len(daily_times) - 1, -1, -1):
        d = datetime.fromisoformat(daily_times[i])
        day_label = "Today" if daily_times[i] == today_str else d.strftime("%A")
        daily_out.append(
            {
                "day": day_label,
                "high": round(daily["temperature_2m_max"][i]),
                "low": round(daily["temperature_2m_min"][i]),
                "condition": condition_from_wmo(daily["weather_code"][i]),
            }
        )

    return {
        "station": STATION,
        "current": current_out,
        "hourly": hourly_out,
        "daily": daily_out,
    }

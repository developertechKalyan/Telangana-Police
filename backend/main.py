import time
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from weather_service import STATION, build_payload, fetch_air_quality, fetch_forecast

app = FastAPI(title="Telangana Police Weather API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

_cache: dict[str, Any] = {"payload": None, "fetched_at": 0.0}
CACHE_TTL_SECONDS = STATION["refreshIntervalMinutes"] * 60


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/weather")
async def get_weather() -> dict[str, Any]:
    now = time.time()
    if _cache["payload"] is not None and now - _cache["fetched_at"] < CACHE_TTL_SECONDS:
        return _cache["payload"]

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            forecast = await fetch_forecast(client)
            air = await fetch_air_quality(client)
        except httpx.HTTPError as exc:
            if _cache["payload"] is not None:
                return _cache["payload"]
            raise HTTPException(status_code=502, detail=f"Upstream weather provider error: {exc}") from exc

    payload = build_payload(forecast, air)
    _cache["payload"] = payload
    _cache["fetched_at"] = now
    return payload

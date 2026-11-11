import { Router, type Request, type Response } from "express";

const router = Router();

// Compatible weather route for the frontend weather widget
router.get("/weather", (_req: Request, res: Response) => {
  const now = new Date();
  
  // Generate realistic live station payload
  const currentTemp = 28 + Math.round(Math.sin(now.getHours() / 3) * 4);
  
  const payload = {
    station: {
      deviceId: "AWS-HYD-04",
      location: "Hyderabad Central Command Control Centre",
      latitude: 17.385,
      longitude: 78.4867,
      timezone: "Asia/Kolkata",
      refreshIntervalMinutes: 5,
    },
    current: {
      temperature: currentTemp,
      feelsLike: currentTemp + 2,
      condition: "Partly Cloudy",
      todayHigh: 34,
      todayLow: 22,
      humidity: 58,
      windSpeed: 14,
      windDirection: 180,
      rainChance: 15,
      precipitation: 0,
      pressure: 1012,
      solarRadiation: 650,
      pm10: 42,
      pm25: 24,
      co: 0.6,
      so2: 8,
      o3: 32,
      no2: 18,
      aqi: 68,
      pollutantStatus: {
        o3: "Normal",
        co: "Normal",
        pm10: "Normal",
        pm25: "Normal",
      },
      updatedAt: now.toISOString(),
    },
    hourly: Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getTime() + i * 3600000);
      const h = d.getHours();
      return {
        hour: `${((h + 11) % 12) + 1} ${h >= 12 ? "PM" : "AM"}`,
        temp: currentTemp + Math.round(Math.sin(i) * 2),
        humidity: Math.min(85, Math.max(40, 58 + i * 2)),
        condition: i % 4 === 0 ? "Cloudy" : "Partly Cloudy",
      };
    }),
    daily: [
      { day: "Today", high: 34, low: 22, condition: "Partly Cloudy" },
      { day: "Tomorrow", high: 35, low: 23, condition: "Sunny" },
      { day: "Wednesday", high: 33, low: 22, condition: "Partly Cloudy" },
      { day: "Thursday", high: 31, low: 21, condition: "Rain" },
      { day: "Friday", high: 32, low: 22, condition: "Partly Cloudy" },
    ],
  };

  res.status(200).json(payload);
});

export default router;

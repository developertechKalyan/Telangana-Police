import { Router, type Request, type Response } from "express";
import { getWeather } from "../services/weather.js";

const router = Router();

// Live readings for the TGiCCC station (Open-Meteo), cached server-side for refreshIntervalMinutes.
router.get("/weather", async (_req: Request, res: Response) => {
  try {
    res.set("Cache-Control", "public, max-age=60");
    res.status(200).json(await getWeather());
  } catch (error) {
    console.error("Weather upstream error:", error);
    res.status(502).json({ success: false, message: "Weather data is temporarily unavailable." });
  }
});

export default router;

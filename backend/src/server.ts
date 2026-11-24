import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { getJwtSecret, isProduction } from "./config/security.js";
import authRoutes from "./routes/authRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

// Load environment variables
dotenv.config();

// Refuse to start without a strong, private JWT secret (a known secret lets anyone forge admin logins).
try {
  getJwtSecret();
} catch (error) {
  console.error(`❌ ${(error as Error).message}`);
  process.exit(1);
}

// Strip MongoDB operators such as {"$ne": ...} from any filter built from request data.
mongoose.set("sanitizeFilter", true);

const app = express();
const PORT = process.env.PORT || 8000;

// Behind a host's proxy (Render, Railway, nginx, ...) set TRUST_PROXY to the number of proxies,
// usually 1, so rate limits see each visitor's real IP instead of the proxy's.
app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 0));
app.disable("x-powered-by");

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
// CLIENT_URL may list several origins, comma-separated. Local dev origins are added outside production.
const allowedOrigins = [
  ...(process.env.CLIENT_URL || "").split(",").map((o) => o.trim()),
  ...(isProduction() ? [] : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://localhost:3000"]),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests with no Origin header (curl, server-to-server) carry no browser cookies or tokens
      // from another site, so they are allowed; browsers on other sites are refused.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: false, // the API uses Authorization headers, not cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// Request Logger in dev
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "Telangana Police Dial 112 API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api", weatherRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Requested API endpoint not found.",
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server Global Error:", err);

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        message: "File size exceeds the 2MB limit. Please upload an image under 2MB.",
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
    return;
  }

  // Custom File filter error
  if (err.message && err.message.includes("Invalid file format")) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Malformed JSON bodies and similar client errors carry their own 4xx status.
  const statusCode =
    typeof err.status === "number" && err.status >= 400 && err.status < 500 ? err.status : 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode < 500 ? "Bad request." : isProduction() ? "An internal error occurred." : err.message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  TELANGANA POLICE DIAL 112 BACKEND RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 Security: Helmet, CORS, Rate Limiters Active`);
  console.log(`🖼️  Image Engine: Cloudinary Stream (Max 2MB)`);
  console.log(`📧 Mail Engine: Nodemailer Brevo SMTP Relay`);
  console.log(`====================================================`);
});

export default app;

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, forgotPassword, verifyOtp, resetPassword, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Strict rate limiter for login to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for forgot password / OTP generation
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 OTP requests per 15 minutes
  message: {
    success: false,
    message: "Too many password reset requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

export default router;

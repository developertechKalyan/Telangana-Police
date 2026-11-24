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

// Limits code checks per IP. Each issued code also locks after 5 wrong guesses (see authController),
// so a 6-digit code can't be brute-forced from many IPs either.
const otpCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many verification attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/verify-otp", otpCheckLimiter, verifyOtp);
router.post("/reset-password", otpCheckLimiter, resetPassword);
router.get("/me", protect, getMe);

export default router;

import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { sendOtpEmail } from "../config/mailer.js";
import type { AuthRequest } from "../middleware/auth.js";
import { getJwtSecret, hashOtp, passwordProblem, safeEqualHex } from "../config/security.js";

/** Wrong reset-code guesses allowed per issued code before it is voided. */
const MAX_OTP_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000;

/** Same reply whether or not the email is registered, so the form can't be used to discover accounts. */
const FORGOT_PASSWORD_REPLY = "If this email is registered, a 6-digit verification code has been sent to it.";
const INVALID_OTP_REPLY = "Invalid or expired verification code. Please request a new one.";

function generateToken(id: string): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];
  return jwt.sign({ id }, getJwtSecret(), { expiresIn, algorithm: "HS256" });
}

/** Reads a required string field from the body; rejects objects such as {"$ne": ""}. */
function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function normaliseEmail(value: unknown): string | null {
  const email = str(value)?.trim().toLowerCase() ?? null;
  return email && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/**
 * Checks a reset code for this email. Counts wrong guesses and voids the code after MAX_OTP_ATTEMPTS,
 * so the 6-digit code can't be brute-forced. Returns the user when the code is right.
 */
async function checkOtp(email: string, otp: string) {
  const user = await User.findOne({ email }).select(
    "+password +resetPasswordOtp +resetPasswordExpires +resetPasswordAttempts"
  );
  if (!user || !user.resetPasswordOtp || !user.resetPasswordExpires || user.resetPasswordExpires.getTime() <= Date.now()) {
    return null;
  }

  if (safeEqualHex(hashOtp(otp), user.resetPasswordOtp)) {
    return user;
  }

  const attempts = (user.resetPasswordAttempts ?? 0) + 1;
  if (attempts >= MAX_OTP_ATTEMPTS) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordAttempts = 0;
  } else {
    user.resetPasswordAttempts = attempts;
  }
  await user.save({ validateBeforeSave: false });
  return null;
}

// @desc    Admin Police Portal Login
// @route   POST /api/auth/login
// @access  Public
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const email = normaliseEmail(req.body?.email);
    const password = str(req.body?.password);

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide both official email address and password.",
      });
      return;
    }

    const user = await User.findOne({ email }).select("+password");

    // One message for every failure, so the form doesn't reveal which emails have accounts.
    if (!user || !user.isActive || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        badgeNumber: user.badgeNumber,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal authentication error. Please try again.",
    });
  }
}

// @desc    Forgot Password - Send OTP to authorized email via Brevo
// @route   POST /api/auth/forgot-password
// @access  Public
export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const email = normaliseEmail(req.body?.email);

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
      return;
    }

    const user = await User.findOne({ email });

    if (user && user.isActive) {
      const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
      user.resetPasswordOtp = hashOtp(otp); // only the hash is stored
      user.resetPasswordExpires = new Date(Date.now() + OTP_TTL_MS);
      user.resetPasswordAttempts = 0;
      await user.save({ validateBeforeSave: false });

      await sendOtpEmail(user.email, otp, user.name);
    }

    res.status(200).json({ success: true, message: FORGOT_PASSWORD_REPLY });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Could not process password reset. Please try again.",
    });
  }
}

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  try {
    const email = normaliseEmail(req.body?.email);
    const otp = str(req.body?.otp)?.trim() ?? (typeof req.body?.otp === "number" ? String(req.body.otp) : null);

    if (!email || !otp || !/^\d{6}$/.test(otp)) {
      res.status(400).json({
        success: false,
        message: "Email and the 6-digit verification code are required.",
      });
      return;
    }

    const user = await checkOtp(email, otp);
    if (!user) {
      res.status(400).json({ success: false, message: INVALID_OTP_REPLY });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Code verified. You may now set your new password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying the code.",
    });
  }
}

// @desc    Reset Password with verified OTP
// @route   POST /api/auth/reset-password
// @access  Public
export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const email = normaliseEmail(req.body?.email);
    const otp = str(req.body?.otp)?.trim() ?? (typeof req.body?.otp === "number" ? String(req.body.otp) : null);
    const newPassword = req.body?.newPassword;

    if (!email || !otp || !/^\d{6}$/.test(otp) || newPassword === undefined) {
      res.status(400).json({
        success: false,
        message: "Email, the 6-digit code and a new password are required.",
      });
      return;
    }

    const problem = passwordProblem(newPassword);
    if (problem) {
      res.status(400).json({ success: false, message: problem });
      return;
    }

    const user = await checkOtp(email, otp);
    if (!user) {
      res.status(400).json({ success: false, message: INVALID_OTP_REPLY });
      return;
    }

    // Set new password (hashed by the pre-save hook, which also records passwordChangedAt
    // so every older login token stops working).
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordAttempts = 0;
    await user.save();

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Password has been updated securely. You are now logged in.",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        badgeNumber: user.badgeNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
}

// @desc    Get current authenticated officer
// @route   GET /api/auth/me
// @access  Protected
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        badgeNumber: req.user.badgeNumber,
        role: req.user.role,
        lastLogin: req.user.lastLogin,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
}

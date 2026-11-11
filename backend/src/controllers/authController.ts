import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { sendOtpEmail } from "../config/mailer.js";
import type { AuthRequest } from "../middleware/auth.js";

function generateToken(id: string): string {
  const secret = process.env.JWT_SECRET || "mp_police_super_secure_jwt_secret_key_2026_!@#$%^";
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];
  return jwt.sign({ id }, secret, { expiresIn });
}

// @desc    Admin Police Portal Login
// @route   POST /api/auth/login
// @access  Public
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide both official email address and password.",
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Authorized personnel only.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your authorized account has been suspended or deactivated.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials. Please verify your password.",
      });
      return;
    }

    // Update last login timestamp
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
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Please enter your authorized email address.",
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Don't leak if email exists or not, but return consistent message
      res.status(200).json({
        success: true,
        message: "If this email is registered, a 6-digit OTP verification code has been dispatched.",
      });
      return;
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpiry;
    await user.save({ validateBeforeSave: false });

    // Send email using Brevo Nodemailer
    await sendOtpEmail(user.email, otp, user.name);

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}.`,
    });
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
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP verification code are required.",
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await User.findOne({
      email: cleanEmail,
      resetPasswordOtp: cleanOtp,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordOtp +resetPasswordExpires");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP verification code.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You may now set your new password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP code.",
    });
  }
}

// @desc    Reset Password with verified OTP
// @route   POST /api/auth/reset-password
// @access  Public
export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Email, OTP code, and new password are required.",
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const user = await User.findOne({
      email: cleanEmail,
      resetPasswordOtp: cleanOtp,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordOtp +resetPasswordExpires");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP verification code. Please request a new one.",
      });
      return;
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
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
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
}

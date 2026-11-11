import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied. Official authentication token is required.",
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "mp_police_super_secure_jwt_secret_key_2026_!@#$%^";
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization credentials or user account deactivated.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session token. Please re-authenticate.",
    });
  }
}

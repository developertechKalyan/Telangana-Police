import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/User.js";
import { getJwtSecret } from "../config/security.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    token = header.slice("Bearer ".length).trim();
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied. Official authentication token is required.",
    });
    return;
  }

  try {
    // Pin the algorithm so a token can't choose a weaker one.
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] }) as jwt.JwtPayload & { id?: string };
    if (typeof decoded.id !== "string") throw new Error("Malformed token");

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization credentials or user account deactivated.",
      });
      return;
    }

    // Tokens issued before the last password change are no longer valid.
    if (user.passwordChangedAt && typeof decoded.iat === "number") {
      const changedAtSeconds = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < changedAtSeconds) {
        res.status(401).json({
          success: false,
          message: "Your password was changed. Please log in again.",
        });
        return;
      }
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session token. Please re-authenticate.",
    });
  }
}

/** Allows the request through only for the listed roles. Use after `protect`. */
export function requireRole(...roles: IUser["role"][]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Your account does not have permission for this action.",
      });
      return;
    }
    next();
  };
}

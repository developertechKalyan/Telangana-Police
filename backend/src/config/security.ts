import crypto from "crypto";

/**
 * Secrets that were published in this repository (in .env.example and as code fallbacks).
 * Anyone with the code knows them, so the server refuses to run with them.
 */
const PUBLISHED_JWT_SECRETS = new Set(["mp_police_super_secure_jwt_secret_key_2026_!@#$%^"]);
export const PUBLISHED_ADMIN_PASSWORDS = new Set(["PoliceAdmin@2026!"]);

const MIN_JWT_SECRET_LENGTH = 32;

/**
 * Returns the JWT signing secret, or throws if it is missing, too short or a published value.
 * There is deliberately no fallback: a default secret would let anyone forge admin logins.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Generate one with: openssl rand -hex 48");
  }
  if (PUBLISHED_JWT_SECRETS.has(secret)) {
    throw new Error("JWT_SECRET is the example value from the repository. Generate a new one with: openssl rand -hex 48");
  }
  if (secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters. Generate one with: openssl rand -hex 48`);
  }
  return secret;
}

/** Stored form of a one-time reset code: never keep the code itself in the database. */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/** Constant-time comparison of two hex digests of equal length. */
export function safeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ab.length === bb.length && ab.length > 0 && crypto.timingSafeEqual(ab, bb);
}

/** Password rule shared by the reset flow and the admin seed script. */
export function passwordProblem(password: unknown): string | null {
  if (typeof password !== "string") return "Password is required.";
  if (password.length < 12) return "Password must be at least 12 characters long.";
  if (password.length > 128) return "Password must be at most 128 characters long.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include upper-case and lower-case letters and a number.";
  }
  if (PUBLISHED_ADMIN_PASSWORDS.has(password)) return "This password is published in the repository. Choose another.";
  return null;
}

export const isProduction = () => process.env.NODE_ENV === "production";

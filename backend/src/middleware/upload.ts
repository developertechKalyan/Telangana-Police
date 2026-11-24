import multer from "multer";
import type { Request } from "express";

// Store files in memory buffer for stream uploading to Cloudinary
const storage = multer.memoryStorage();

// Maximum allowed size: 2 Megabytes (2 MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Raster formats only. SVG is refused because it can carry scripts that run when the file is opened.
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only JPEG, PNG, WEBP and GIF images are accepted."));
  }
};

/**
 * The browser-supplied type can be faked, so check the file's first bytes too.
 * Returns the real format, or null if the bytes are not one of the allowed images.
 */
export function detectImageType(buffer: Buffer): "jpeg" | "png" | "webp" | "gif" | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpeg";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  const gif = buffer.toString("ascii", 0, 6);
  if (gif === "GIF87a" || gif === "GIF89a") return "gif";
  return null;
}

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 20,
  },
  fileFilter,
});

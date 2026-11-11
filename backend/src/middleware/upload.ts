import multer from "multer";
import type { Request } from "express";

// Store files in memory buffer for stream uploading to Cloudinary
const storage = multer.memoryStorage();

// Maximum allowed size: 2 Megabytes (2 MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Filter for image formats (accepting all image formats)
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only image formats (JPEG, PNG, WEBP, GIF, SVG, BMP, HEIC) are accepted."));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

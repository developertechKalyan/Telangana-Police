import mongoose from "mongoose";
import type { Request, Response } from "express";
import { Gallery } from "../models/Gallery.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import type { AuthRequest } from "../middleware/auth.js";
import { detectImageType } from "../middleware/upload.js";
import { isProduction } from "../config/security.js";

const CATEGORIES = ["Parade", "Operation", "Community", "Traffic", "Cyber Safety", "Events", "Fleet", "General"] as const;
const TYPES = ["photo", "video"] as const;

/** Only plain strings from the allowed list; anything else (e.g. ?category[$ne]=x) is ignored. */
function pick<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

function optionalText(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;
}

/** Internal error details only outside production. */
function publicError(error: unknown, fallback: string): string {
  return !isProduction() && error instanceof Error && error.message ? error.message : fallback;
}

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export async function getGalleryItems(req: Request, res: Response): Promise<void> {
  try {
    const { category, type, featured, limit } = req.query;

    const query: Record<string, string | boolean> = {};
    const cat = pick(category, CATEGORIES);
    if (cat) query.category = cat;
    const kind = pick(type, TYPES);
    if (kind) query.type = kind;
    if (featured === "true") {
      query.featured = true;
    }

    const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : NaN;
    const maxLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 100;
    const items = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .limit(maxLimit)
      .populate("postedBy", "name badgeNumber");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Fetch gallery items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery items.",
    });
  }
}

// @desc    Get single gallery item by ID
// @route   GET /api/gallery/:id
// @access  Public
export async function getGalleryItemById(req: Request, res: Response): Promise<void> {
  try {
    const item = mongoose.isValidObjectId(req.params.id) ? await Gallery.findById(req.params.id) : null;
    if (!item) {
      res.status(404).json({ success: false, message: "Gallery item not found" });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching gallery item" });
  }
}

// @desc    Upload single image post to Cloudinary & store in MongoDB
// @route   POST /api/gallery
// @access  Protected
export async function uploadGalleryItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Please upload an image file (Max size 2MB).",
      });
      return;
    }

    const title = optionalText(req.body?.title, 200);
    const description = optionalText(req.body?.description, 1000);
    const category = pick(req.body?.category, CATEGORIES) ?? "General";
    const featured = req.body?.featured === "true" || req.body?.featured === true;
    const captionEn = optionalText(req.body?.captionEn, 500);
    const captionHi = optionalText(req.body?.captionHi, 500);
    const captionTe = optionalText(req.body?.captionTe, 500);
    const captionGu = optionalText(req.body?.captionGu, 500);
    const captionUr = optionalText(req.body?.captionUr, 500);
    const captionSd = optionalText(req.body?.captionSd, 500);

    if (!title) {
      res.status(400).json({
        success: false,
        message: "Title is required for every official gallery entry.",
      });
      return;
    }

    const realType = detectImageType(file.buffer);
    if (!realType) {
      res.status(400).json({
        success: false,
        message: "This file is not a valid JPEG, PNG, WEBP or GIF image.",
      });
      return;
    }

    // Upload image to Cloudinary via stream
    const uploadResult = await uploadToCloudinary(file.buffer, "mppolice_gallery", realType);

    const captionText = captionEn || title;

    const newItem = await Gallery.create({
      title,
      description,
      caption: {
        en: captionText,
        hi: captionHi || captionText,
        te: captionTe || captionText,
        gu: captionGu || captionText,
        ur: captionUr || captionText,
        sd: captionSd || captionText,
      },
      category,
      imageUrl: uploadResult.secure_url || uploadResult.url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      fileSize: uploadResult.bytes || file.size,
      format: uploadResult.format || realType,
      type: "photo",
      featured,
      postedBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Image successfully uploaded and posted to gallery.",
      data: newItem,
    });
  } catch (error) {
    console.error("Upload gallery error:", error);
    res.status(500).json({
      success: false,
      message: publicError(error, "Failed to process image upload."),
    });
  }
}

// @desc    Bulk Upload multiple image posts to Cloudinary & store in MongoDB
// @route   POST /api/gallery/bulk
// @access  Protected
export async function uploadBulkGalleryItems(req: AuthRequest, res: Response): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please upload at least one image file (Max 2MB per image).",
      });
      return;
    }

    const baseTitle = optionalText(req.body?.baseTitle, 180);
    const category = pick(req.body?.category, CATEGORIES) ?? "General";
    const description = optionalText(req.body?.description, 1000);
    const featured = req.body?.featured === "true" || req.body?.featured === true;

    const createdItems: any[] = [];
    const errors: string[] = [];

    // Process all files in parallel with Cloudinary
    await Promise.all(
      files.map(async (file, index) => {
        try {
          const realType = detectImageType(file.buffer);
          if (!realType) throw new Error("not a valid JPEG, PNG, WEBP or GIF image");
          const uploadResult = await uploadToCloudinary(file.buffer, "mppolice_gallery", realType);
          const cleanedName = file.originalname.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").slice(0, 180) || "Gallery image";
          const itemTitle = baseTitle
            ? `${baseTitle} #${index + 1}`
            : cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);

          const item = await Gallery.create({
            title: itemTitle,
            description,
            caption: {
              en: itemTitle,
              hi: itemTitle,
              te: itemTitle,
              gu: itemTitle,
              ur: itemTitle,
              sd: itemTitle,
            },
            category,
            imageUrl: uploadResult.secure_url || uploadResult.url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            fileSize: uploadResult.bytes || file.size,
            format: uploadResult.format || realType,
            type: "photo",
            featured,
            postedBy: req.user?._id,
          });

          createdItems.push(item);
        } catch (err: any) {
          console.error(`Error uploading file ${file.originalname}:`, err);
          errors.push(`${file.originalname}: ${publicError(err, "upload failed")}`);
        }
      })
    );

    if (createdItems.length === 0) {
      res.status(500).json({
        success: false,
        message: "Failed to upload any images from the batch.",
        errors,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded and published ${createdItems.length} images to the gallery!`,
      count: createdItems.length,
      data: createdItems,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Bulk upload gallery error:", error);
    res.status(500).json({
      success: false,
      message: publicError(error, "Failed to process bulk upload."),
    });
  }
}

// @desc    Delete any gallery item from Cloudinary and MongoDB (Authorized Officer)
// @route   DELETE /api/gallery/:id
// @access  Protected
export async function deleteGalleryItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const item = mongoose.isValidObjectId(req.params.id) ? await Gallery.findById(req.params.id) : null;

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Gallery item not found.",
      });
      return;
    }

    // Delete image from Cloudinary
    if (item.publicId) {
      try {
        await deleteFromCloudinary(item.publicId);
      } catch (cloudErr) {
        console.warn("Cloudinary delete warning:", cloudErr);
      }
    }

    // Delete document from MongoDB
    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gallery image and record successfully deleted.",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete gallery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item.",
    });
  }
}

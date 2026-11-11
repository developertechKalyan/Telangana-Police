import type { Request, Response } from "express";
import { Gallery } from "../models/Gallery.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import type { AuthRequest } from "../middleware/auth.js";

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export async function getGalleryItems(req: Request, res: Response): Promise<void> {
  try {
    const { category, type, featured, limit } = req.query;

    const query: any = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    if (featured === "true") {
      query.featured = true;
    }

    const maxLimit = limit ? Math.min(parseInt(limit as string, 10), 100) : 100;
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
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: "Gallery item not found" });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
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

    const {
      title,
      description,
      category = "General",
      captionEn,
      captionHi,
      captionTe,
      captionGu,
      captionUr,
      captionSd,
      featured = "false",
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({
        success: false,
        message: "Title is required for every official gallery entry.",
      });
      return;
    }

    // Upload image to Cloudinary via stream
    const uploadResult = await uploadToCloudinary(file.buffer, "mppolice_gallery");

    const captionText = captionEn || title;

    const newItem = await Gallery.create({
      title: title.trim(),
      description: description ? description.trim() : undefined,
      caption: {
        en: captionText.trim(),
        hi: captionHi?.trim() || captionText.trim(),
        te: captionTe?.trim() || captionText.trim(),
        gu: captionGu?.trim() || captionText.trim(),
        ur: captionUr?.trim() || captionText.trim(),
        sd: captionSd?.trim() || captionText.trim(),
      },
      category,
      imageUrl: uploadResult.secure_url || uploadResult.url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      fileSize: uploadResult.bytes || file.size,
      format: uploadResult.format || file.mimetype.split("/")[1] || "jpeg",
      type: "photo",
      featured: featured === "true" || featured === true,
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
      message: (error as Error).message || "Failed to process image upload.",
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

    const {
      baseTitle,
      category = "General",
      description,
      featured = "false",
    } = req.body;

    const createdItems: any[] = [];
    const errors: string[] = [];

    // Process all files in parallel with Cloudinary
    await Promise.all(
      files.map(async (file, index) => {
        try {
          const uploadResult = await uploadToCloudinary(file.buffer, "mppolice_gallery");
          const cleanedName = file.originalname.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          const itemTitle = baseTitle
            ? `${baseTitle} #${index + 1}`
            : cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);

          const item = await Gallery.create({
            title: itemTitle,
            description: description ? description.trim() : undefined,
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
            format: uploadResult.format || file.mimetype.split("/")[1] || "jpeg",
            type: "photo",
            featured: featured === "true" || featured === true,
            postedBy: req.user?._id,
          });

          createdItems.push(item);
        } catch (err: any) {
          console.error(`Error uploading file ${file.originalname}:`, err);
          errors.push(`${file.originalname}: ${err.message}`);
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
      message: (error as Error).message || "Failed to process bulk upload.",
    });
  }
}

// @desc    Delete any gallery item from Cloudinary and MongoDB (Authorized Officer)
// @route   DELETE /api/gallery/:id
// @access  Protected
export async function deleteGalleryItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const item = await Gallery.findById(req.params.id);

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

import { Router } from "express";
import {
  getGalleryItems,
  getGalleryItemById,
  uploadGalleryItem,
  uploadBulkGalleryItems,
  deleteGalleryItem,
} from "../controllers/galleryController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Public routes
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItemById);

// Protected routes (Any logged-in authorized police officer with valid JWT)
// Single image upload
router.post("/", protect, upload.single("image"), uploadGalleryItem);

// Bulk images upload (up to 20 images in one batch, max 2MB each)
router.post("/bulk", protect, upload.array("images", 20), uploadBulkGalleryItems);

// Delete any gallery image
router.delete("/:id", protect, deleteGalleryItem);

export default router;

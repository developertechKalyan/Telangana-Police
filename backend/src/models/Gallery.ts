import mongoose, { Document, Schema } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  description?: string;
  caption: {
    en: string;
    hi?: string;
    te?: string;
    gu?: string;
    ur?: string;
    sd?: string;
  };
  category: "Parade" | "Operation" | "Community" | "Traffic" | "Cyber Safety" | "Events" | "Fleet" | "General";
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  type: "photo" | "video";
  videoUrl?: string;
  featured: boolean;
  postedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    caption: {
      en: { type: String, required: true },
      hi: { type: String },
      te: { type: String },
      gu: { type: String },
      ur: { type: String },
      sd: { type: String },
    },
    category: {
      type: String,
      enum: ["Parade", "Operation", "Community", "Traffic", "Cyber Safety", "Events", "Fleet", "General"],
      default: "General",
      index: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
    width: { type: Number },
    height: { type: Number },
    fileSize: { type: Number },
    format: { type: String },
    type: {
      type: String,
      enum: ["photo", "video"],
      default: "photo",
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = mongoose.model<IGalleryItem>("Gallery", GallerySchema);

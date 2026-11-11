import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "mppolice_gallery"
): Promise<UploadApiResponse> {
  // If Cloudinary keys are not set, return a mock response or fallback URL in dev
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn("⚠️ Cloudinary credentials missing in .env. Converting image to base64 data URI for dev storage.");
    const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    return {
      public_id: `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      secure_url: base64,
      url: base64,
      width: 1200,
      height: 800,
      format: "jpg",
      bytes: buffer.length,
      resource_type: "image",
    } as UploadApiResponse;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto:good", fetch_format: "auto" },
          { max_width: 2400, max_height: 2400, crop: "limit" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Failed to upload image to Cloudinary"));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<any> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET ||
    publicId.startsWith("dev_")
  ) {
    return { result: "ok" };
  }
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;

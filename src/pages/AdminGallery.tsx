import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCloudArrowUp,
  FaShieldHalved,
  FaTrashCan,
  FaEye,
  FaXmark,
  FaArrowRightFromBracket,
  FaCircleCheck,
  FaImage,
  FaImages,
  FaArrowUpRightFromSquare,
  FaCameraRetro,
  FaLayerGroup,
} from "react-icons/fa6";
import { LuLoaderCircle, LuTriangleAlert, LuSparkles } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchGalleryItems,
  uploadGalleryItemApi,
  uploadBulkGalleryItemsApi,
  deleteGalleryItemApi,
  type ApiGalleryItem,
} from "@/lib/api";
import { MotionSection } from "@/components/MotionSection";

const CATEGORIES = [
  "General",
  "Parade",
  "Operation",
  "Community",
  "Traffic",
  "Cyber Safety",
  "Events",
  "Fleet",
] as const;

type UploadMode = "single" | "bulk";

interface BulkFileItem {
  id: string;
  file: File;
  previewUrl: string;
  sizeMB: string;
  isValid: boolean;
  error?: string;
}

export function AdminGallery() {
  const { user, logout } = useAuth();

  const [items, setItems] = useState<ApiGalleryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [uploadMode, setUploadMode] = useState<UploadMode>("single");

  // Single Upload Form states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("General");
  const [description, setDescription] = useState("");
  const [captionEn, setCaptionEn] = useState("");
  const [captionHi, setCaptionHi] = useState("");
  const [captionTe, setCaptionTe] = useState("");
  const [featured, setFeatured] = useState(false);

  // Bulk Upload Form states
  const [bulkFiles, setBulkFiles] = useState<BulkFileItem[]>([]);
  const [bulkBaseTitle, setBulkBaseTitle] = useState("");
  const [bulkCategory, setBulkCategory] = useState<(typeof CATEGORIES)[number]>("General");
  const [bulkDescription, setBulkDescription] = useState("");
  const [bulkFeatured, setBulkFeatured] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const singleInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded items
  const loadItems = async () => {
    setLoadingItems(true);
    try {
      const data = await fetchGalleryItems(activeFilter === "All" ? undefined : activeFilter);
      setItems(data);
    } catch (err) {
      console.warn("Could not load gallery items:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [activeFilter]);

  // Single file selection with 2MB validation
  const handleSingleFileChange = (selectedFile: File | null) => {
    setError(null);
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Unsupported format. Please select an image file (JPEG, PNG, WEBP, GIF, SVG, BMP, HEIC).");
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      setError(`Image file size is ${sizeMB} MB. Maximum allowed size is 2.00 MB.`);
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  // Bulk files selection
  const handleBulkFilesAdd = (selectedFiles: FileList | null) => {
    setError(null);
    if (!selectedFiles || selectedFiles.length === 0) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    const newItems: BulkFileItem[] = [];

    Array.from(selectedFiles).forEach((f) => {
      const isImg = f.type.startsWith("image/");
      const isSizeOk = f.size <= MAX_SIZE;
      const sizeMB = (f.size / (1024 * 1024)).toFixed(2);

      let err: string | undefined;
      if (!isImg) err = "Not an image";
      else if (!isSizeOk) err = `Exceeds 2MB (${sizeMB} MB)`;

      newItems.push({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        sizeMB,
        isValid: isImg && isSizeOk,
        error: err,
      });
    });

    setBulkFiles((prev) => [...prev, ...newItems]);
  };

  const removeBulkFile = (id: string) => {
    setBulkFiles((prev) => prev.filter((item) => item.id !== id));
  };

  // Submit single photo post
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file to upload (Max 2MB).");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title for the official gallery entry.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title.trim());
    formData.append("category", category);
    if (description.trim()) formData.append("description", description.trim());
    formData.append("captionEn", captionEn.trim() || title.trim());
    if (captionHi.trim()) formData.append("captionHi", captionHi.trim());
    if (captionTe.trim()) formData.append("captionTe", captionTe.trim());
    formData.append("featured", String(featured));

    try {
      await uploadGalleryItemApi(formData);
      setSuccessMsg("Image successfully uploaded to Cloudinary and published to official gallery!");
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      setCaptionEn("");
      setCaptionHi("");
      setCaptionTe("");
      setFeatured(false);
      if (singleInputRef.current) singleInputRef.current.value = "";
      loadItems();
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Submit bulk photo posts
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validFiles = bulkFiles.filter((f) => f.isValid);
    if (validFiles.length === 0) {
      setError("Please add at least one valid image file under 2.00 MB.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    validFiles.forEach((f) => {
      formData.append("images", f.file);
    });
    if (bulkBaseTitle.trim()) formData.append("baseTitle", bulkBaseTitle.trim());
    formData.append("category", bulkCategory);
    if (bulkDescription.trim()) formData.append("description", bulkDescription.trim());
    formData.append("featured", String(bulkFeatured));

    try {
      const res = await uploadBulkGalleryItemsApi(formData);
      setSuccessMsg(res.message || `Successfully bulk uploaded ${validFiles.length} photos!`);
      setBulkFiles([]);
      setBulkBaseTitle("");
      setBulkDescription("");
      setBulkFeatured(false);
      if (bulkInputRef.current) bulkInputRef.current.value = "";
      loadItems();
    } catch (err: any) {
      setError(err.message || "Failed to complete bulk image upload.");
    } finally {
      setUploading(false);
    }
  };

  // Delete any image post
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteGalleryItemApi(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Could not delete image.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Top Navigation Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-navy-800 bg-navy-900/90 p-5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-500/30 bg-navy-950 text-accent-400">
              <FaShieldHalved size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-bold text-white">Gallery Command Dashboard</h1>
                <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-bold text-accent-400 border border-accent-500/20">
                  {user?.role?.toUpperCase() || "OFFICER"}
                </span>
              </div>
              <p className="text-xs text-navy-400">
                Authorized Personnel: <span className="font-medium text-navy-200">{user?.name}</span> ({user?.badgeNumber || user?.email})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/gallery"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy-700 bg-navy-800 px-4 py-2 text-xs font-semibold text-navy-200 transition-colors hover:bg-navy-700 hover:text-white"
            >
              <FaEye size={13} /> View Live Gallery <FaArrowUpRightFromSquare size={11} className="opacity-60" />
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200"
            >
              <FaArrowRightFromBracket size={13} /> Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Grid: Upload Form on Left, Uploaded Items on Right */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT: Upload Form (Single vs Bulk Toggle) (5 cols) */}
          <div className="lg:col-span-5">
            <MotionSection className="rounded-3xl border border-navy-800 bg-navy-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              {/* Header & Mode Switcher */}
              <div className="border-b border-navy-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCameraRetro size={18} className="text-accent-400" />
                    <h2 className="font-display text-base font-bold text-white">Post Gallery Media</h2>
                  </div>
                  <span className="text-[11px] font-semibold text-accent-400">Max 2 MB / image</span>
                </div>

                {/* Mode Tabs */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-navy-950 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode("single");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                      uploadMode === "single"
                        ? "bg-brand-600 text-white shadow-md"
                        : "text-navy-400 hover:text-white"
                    }`}
                  >
                    <FaImage size={13} /> Single Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode("bulk");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                      uploadMode === "bulk"
                        ? "bg-brand-600 text-white shadow-md"
                        : "text-navy-400 hover:text-white"
                    }`}
                  >
                    <FaImages size={13} /> Bulk Upload ({bulkFiles.length})
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200"
                  >
                    <LuTriangleAlert size={16} className="flex-none text-red-400 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200"
                  >
                    <FaCircleCheck size={16} className="flex-none text-emerald-400 mt-0.5" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SINGLE PHOTO FORM */}
              {uploadMode === "single" ? (
                <form onSubmit={handleSingleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Upload Photo <span className="text-accent-400">*</span>
                    </label>
                    <input
                      ref={singleInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleFileChange(e.target.files?.[0] || null)}
                      className="hidden"
                    />

                    {previewUrl ? (
                      <div className="relative mt-2 overflow-hidden rounded-2xl border border-navy-700 bg-navy-950 p-2">
                        <img src={previewUrl} alt="Preview" className="h-48 w-full rounded-xl object-cover" />
                        <div className="mt-2 flex items-center justify-between px-2 text-xs text-navy-300">
                          <span className="truncate max-w-[200px]">{file?.name}</span>
                          <span className="font-mono font-semibold text-accent-400">
                            {(file!.size / (1024 * 1024)).toFixed(2)} MB / 2.00 MB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSingleFileChange(null)}
                          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-navy-950/80 text-white backdrop-blur hover:bg-red-600 transition-colors"
                        >
                          <FaXmark size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => singleInputRef.current?.click()}
                        className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-700 bg-navy-950/60 p-7 text-center transition-colors hover:border-accent-400 hover:bg-navy-950"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                          <FaCloudArrowUp size={24} />
                        </div>
                        <p className="mt-3 text-xs font-semibold text-navy-200">Click to upload or drag photo</p>
                        <p className="mt-1 text-[11px] text-navy-400">Any format (Max size 2.00 MB)</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Image Title <span className="text-accent-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Police Commemoration Parade 2026"
                      className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-950 py-2.5 px-3.5 text-sm text-white placeholder-navy-500 focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Category Tag
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-950 py-2.5 px-3.5 text-sm text-white focus:border-accent-400 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-navy-800 bg-navy-950/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-300">
                      Multi-Language Captions
                    </p>
                    <input
                      type="text"
                      value={captionEn}
                      onChange={(e) => setCaptionEn(e.target.value)}
                      placeholder="English caption (defaults to title)"
                      className="w-full rounded-lg border border-navy-700 bg-navy-950 py-2 px-3 text-xs text-white placeholder-navy-600 focus:border-accent-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={captionHi}
                      onChange={(e) => setCaptionHi(e.target.value)}
                      placeholder="हिंदी विवरण (Hindi)..."
                      className="w-full rounded-lg border border-navy-700 bg-navy-950 py-2 px-3 text-xs text-white placeholder-navy-600 focus:border-accent-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={captionTe}
                      onChange={(e) => setCaptionTe(e.target.value)}
                      placeholder="తెలుగు వివరణ (Telugu)..."
                      className="w-full rounded-lg border border-navy-700 bg-navy-950 py-2 px-3 text-xs text-white placeholder-navy-600 focus:border-accent-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featured-single"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-navy-700 bg-navy-950 text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="featured-single" className="cursor-pointer text-xs font-medium text-navy-200">
                      Feature on Website Home 3D Carousel
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={uploading || !file}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 via-brand-600 to-brand-700 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <LuLoaderCircle size={18} className="animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <FaCloudArrowUp size={16} />
                        <span>Publish Photo to Gallery</span>
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                /* BULK MULTI-PHOTO UPLOAD FORM */
                <form onSubmit={handleBulkSubmit} className="mt-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                        Select Multiple Photos (Up to 20)
                      </label>
                      {bulkFiles.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setBulkFiles([])}
                          className="text-[11px] text-red-400 hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <input
                      ref={bulkInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleBulkFilesAdd(e.target.files)}
                      className="hidden"
                    />

                    <div
                      onClick={() => bulkInputRef.current?.click()}
                      className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-700 bg-navy-950/60 p-6 text-center transition-colors hover:border-accent-400 hover:bg-navy-950"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-400">
                        <FaImages size={24} />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-navy-200">
                        Click to select or drop multiple image files
                      </p>
                      <p className="mt-1 text-[11px] text-navy-400">
                        Select up to 20 photos at once (Max 2.00 MB each)
                      </p>
                    </div>

                    {/* Selected Bulk Files List */}
                    {bulkFiles.length > 0 && (
                      <div className="mt-3 max-h-52 overflow-y-auto space-y-2 rounded-2xl border border-navy-800 bg-navy-950/70 p-2.5">
                        {bulkFiles.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-navy-800 bg-navy-900/90 p-2 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={item.previewUrl} alt="" className="h-9 w-9 rounded-lg object-cover flex-none" />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-white max-w-[170px]">{item.file.name}</p>
                                <p className="text-[10px] text-navy-400 font-mono">
                                  {item.sizeMB} MB {item.error ? <span className="text-red-400 font-semibold">• {item.error}</span> : <span className="text-emerald-400">• Ready</span>}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBulkFile(item.id)}
                              className="text-navy-400 hover:text-red-400 p-1"
                            >
                              <FaXmark size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Batch Event / Base Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={bulkBaseTitle}
                      onChange={(e) => setBulkBaseTitle(e.target.value)}
                      placeholder="e.g., Annual Police Sports Meet 2026"
                      className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-950 py-2.5 px-3.5 text-sm text-white placeholder-navy-500 focus:border-accent-400 focus:outline-none"
                    />
                    <p className="mt-1 text-[10px] text-navy-400">
                      If provided, images will be named "Title #1", "Title #2", etc. Otherwise file names are used.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Category Tag for Batch
                    </label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-950 py-2.5 px-3.5 text-sm text-white focus:border-accent-400 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                      Event Summary Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={bulkDescription}
                      onChange={(e) => setBulkDescription(e.target.value)}
                      placeholder="Description applied to this photo batch..."
                      className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-950 py-2 px-3 text-xs text-white placeholder-navy-500 focus:border-accent-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featured-bulk"
                      checked={bulkFeatured}
                      onChange={(e) => setBulkFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-navy-700 bg-navy-950 text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="featured-bulk" className="cursor-pointer text-xs font-medium text-navy-200">
                      Feature on Website Home 3D Carousel
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={uploading || bulkFiles.filter((f) => f.isValid).length === 0}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 via-brand-600 to-brand-700 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <LuLoaderCircle size={18} className="animate-spin" />
                        <span>Uploading {bulkFiles.filter((f) => f.isValid).length} Images to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <FaLayerGroup size={16} />
                        <span>Upload All {bulkFiles.filter((f) => f.isValid).length} Photos in Batch</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </MotionSection>
          </div>

          {/* RIGHT: Uploaded Gallery Items & Delete Controls (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-navy-800 bg-navy-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
              {/* Header & Filter Tabs */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-navy-800 pb-4">
                <div>
                  <h2 className="font-display text-base font-bold text-white">Live Gallery Posts</h2>
                  <p className="text-xs text-navy-400">
                    {items.length} dynamic images • You can delete any post below
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["All", ...CATEGORIES.slice(1, 6)].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        activeFilter === cat
                          ? "bg-brand-600 text-white"
                          : "bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              {loadingItems ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <LuLoaderCircle size={28} className="animate-spin text-brand-500" />
                  <p className="text-xs text-navy-400">Loading Cloudinary gallery records...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-center p-6 rounded-2xl border border-dashed border-navy-800 bg-navy-950/40 mt-6">
                  <FaImage size={32} className="text-navy-600" />
                  <p className="text-sm font-semibold text-navy-300">No dynamic images in this category</p>
                  <p className="text-xs text-navy-400 max-w-sm">
                    Use single upload or bulk upload on the left to add official police photos.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative overflow-hidden rounded-2xl border border-navy-800 bg-navy-950/80 shadow-md"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-navy-900">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="rounded-md bg-navy-950/80 px-2 py-0.5 text-[10px] font-semibold text-accent-300 backdrop-blur">
                            {item.category}
                          </span>
                          {item.featured && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/80 px-1.5 py-0.5 text-[9px] font-bold text-navy-950 backdrop-blur">
                              <LuSparkles size={10} /> Carousel
                            </span>
                          )}
                        </div>

                        {/* Quick Delete Overlay Button */}
                        <button
                          onClick={() => setDeleteId(item._id)}
                          title="Delete image permanently"
                          className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/80 text-white backdrop-blur transition-transform hover:scale-110 hover:bg-red-600 cursor-pointer"
                        >
                          <FaTrashCan size={11} />
                        </button>
                      </div>

                      <div className="p-3.5">
                        <h3 className="line-clamp-1 font-display text-sm font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-navy-400">
                          {item.caption?.en || item.description || "No caption"}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-navy-800/80 pt-2.5 text-[11px] text-navy-400">
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          <button
                            onClick={() => setDeleteId(item._id)}
                            className="flex items-center gap-1 text-red-400 transition-colors hover:text-red-300 font-medium"
                          >
                            <FaTrashCan size={11} /> Delete Image
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-navy-700 bg-navy-900 p-6 shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                <FaTrashCan size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">Delete Gallery Image?</h3>
              <p className="mt-1.5 text-xs text-navy-300">
                As an authorized officer, this image will be immediately and permanently removed from Cloudinary and the live website.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-navy-700 bg-navy-800 py-2.5 text-xs font-semibold text-navy-200 hover:bg-navy-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteId && handleDelete(deleteId)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-500"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

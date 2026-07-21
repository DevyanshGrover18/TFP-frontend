"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import DeleteModal from "@/components/common/DeleteModal";
import { addImages, deleteImageById, getAllImages } from "@/services/homeServices";
import { uploadProductImage } from "@/services/uploadsService";






export default function HeroImagesPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const res = await getAllImages();
      if (res.success && res.images) {
        setImages(res.images);
      }
    } catch {
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadImages();
  }, []);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
      uploadProductImage(file, "homepage")
      );
      const urls = await Promise.all(uploadPromises);

      const res = await addImages(urls);

      if (!res.success) throw new Error(res.message);
      toast.success("Images uploaded successfully");
      await loadImages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteImageById(deleteTarget._id);
      if (!res.success) throw new Error(res.message);
      toast.success("Image deleted successfully");
      setDeleteTarget(null);
      await loadImages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };


  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    void handleUpload(e.dataTransfer.files);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Homepage Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Hero Images
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Upload and manage the banner images shown in the hero section of the
            homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          
          <Upload size={16} />
          {isUploading ? "Uploading..." : "Upload images"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleUpload(e.target.files)} />
        
      </div>

      {/* Upload dropzone */}
      <div
        onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-10 transition ${
        dragOver ?
        "border-red-400 bg-red-50" :
        "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"}`
        }>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
          <ImagePlus size={22} className="text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {dragOver ? "Drop to upload" : "Drag & drop images here"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            or click anywhere to browse — PNG, JPG, WEBP supported
          </p>
        </div>
        {isUploading &&
        <p className="text-xs font-medium text-red-500">Uploading...</p>
        }
      </div>

      {/* Images grid */}
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between px-1 pb-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Uploaded Images
          </h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
        </div>

        {isLoading ?
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) =>
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-gray-100"
            style={{ aspectRatio: "16/9" }} />

          )}
          </div> :
        images.length > 0 ?
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) =>
          <div
            key={image._id}
            className="group relative overflow-hidden rounded-2xl border border-gray-200"
            style={{ aspectRatio: "16/9" }}>
            
                <img
              src={image.url}
              alt={`Hero image ${index + 1}`}
              className="h-full w-full object-cover transition group-hover:scale-105" />
            

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                  <button
                type="button"
                onClick={() => setDeleteTarget(image)}
                className="scale-75 rounded-xl border border-white/30 bg-white/10 p-2.5 text-white opacity-0 backdrop-blur-sm transition group-hover:scale-100 group-hover:opacity-100 hover:bg-red-500">
                
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Index badge */}
                <span className="absolute left-2 top-2 rounded-lg bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {index + 1}
                </span>
              </div>
          )}
          </div> :

        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            No images uploaded yet. Add some to populate the hero section.
          </div>
        }
      </div>

      <DeleteModal
        isOpen={deleteTarget !== null}
        title="Delete image"
        description="This will permanently remove the image from the hero section."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()} />
      
    </section>);

}
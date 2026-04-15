"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

type CategoryModalProps = {
  isOpen: boolean;
  mode: "create" | "update";
  title: string;
  parentLabel: string;
  initialName?: string;
  initialImage?: string;
  submitLabel: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; image: string }) => void | Promise<void>;
};

const CategoryModal = ({
  isOpen,
  mode,
  title,
  parentLabel,
  initialName = "",
  initialImage = "",
  submitLabel,
  isLoading = false,
  onClose,
  onSubmit,
}: CategoryModalProps) => {
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [preview, setPreview] = useState(initialImage);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(initialName);
    setImage(initialImage);
    setPreview(initialImage);
    setError("");
  }, [initialImage, initialName, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setImage(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }

    if (mode === "create" && !image.trim()) {
      setError("Image is required");
      return;
    }

    setError("");
    void onSubmit({ name: trimmedName, image: image.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-5">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">Parent: {parentLabel}</p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <label className="block space-y-2 text-sm font-medium text-gray-700">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="Enter category name"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-gray-700">
            <span>Image</span>
            <input
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white"
            />
          </label>

          {preview ? (
            <div className="rounded-2xl border border-gray-200 p-3">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
                Preview
              </p>
              <img
                src={preview}
                alt="Category preview"
                className="h-36 w-full rounded-xl object-cover"
              />
            </div>
          ) : null}

          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

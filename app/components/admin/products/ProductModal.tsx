"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";

export type CategoryNode = {
  _id: string;
  name: string;
  children?: CategoryNode[];
};

export type ProductFormValues = {
  sku: string;
  name: string;
  image: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  composition: string;
  color: string;
  width: string;
  weight: string;
};

type ProductModalProps = {
  isOpen: boolean;
  mode: "create" | "update";
  categories: CategoryNode[];
  initialValues?: Partial<ProductFormValues>;
  productId?: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
};

const emptyValues: ProductFormValues = {
  sku: "",
  name: "",
  image: "",
  categoryId: "",
  subCategoryId: "",
  subSubCategoryId: "",
  composition: "",
  color: "",
  width: "",
  weight: "",
};

function findNode(nodes: CategoryNode[], id: string): CategoryNode | null {
  for (const node of nodes) {
    if (node._id === id) {
      return node;
    }

    const childMatch = findNode(node.children ?? [], id);
    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

const ProductModal = ({
  isOpen,
  mode,
  categories,
  initialValues,
  productId,
  isLoading = false,
  onClose,
  onSubmit,
}: ProductModalProps) => {
  const [values, setValues] = useState<ProductFormValues>(emptyValues);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextValues = {
      ...emptyValues,
      ...initialValues,
    };

    setValues(nextValues);
    setPreview(nextValues.image);
    setError("");
  }, [initialValues, isOpen]);

  const selectedRoot = useMemo(
    () => categories.find((category) => category._id === values.categoryId) ?? null,
    [categories, values.categoryId],
  );

  const subCategories = selectedRoot?.children ?? [];
  const selectedSub = useMemo(
    () => subCategories.find((category) => category._id === values.subCategoryId) ?? null,
    [subCategories, values.subCategoryId],
  );

  const subSubCategories = selectedSub?.children ?? [];

  if (!isOpen) {
    return null;
  }

  const updateField = <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateField("image", result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRootChange = (value: string) => {
    const nextRoot = findNode(categories, value);
    setValues((current) => ({
      ...current,
      categoryId: value,
      subCategoryId: nextRoot?.children?.[0]?._id ?? "",
      subSubCategoryId: nextRoot?.children?.[0]?.children?.[0]?._id ?? "",
    }));
  };

  const handleSubChange = (value: string) => {
    const nextSub = findNode(subCategories, value);
    setValues((current) => ({
      ...current,
      subCategoryId: value,
      subSubCategoryId: nextSub?.children?.[0]?._id ?? "",
    }));
  };

  const handleSubmit = () => {
    const trimmed: ProductFormValues = {
      sku: values.sku.trim(),
      name: values.name.trim(),
      image: values.image.trim(),
      categoryId: values.categoryId.trim(),
      subCategoryId: values.subCategoryId.trim(),
      subSubCategoryId: values.subSubCategoryId.trim(),
      composition: values.composition.trim(),
      color: values.color.trim(),
      width: values.width.trim(),
      weight: values.weight.trim(),
    };

    const requiredFields = [
      "sku",
      "name",
      "image",
      "categoryId",
      "subCategoryId",
      "subSubCategoryId",
      "composition",
      "color",
      "width",
      "weight",
    ] as const;

    const missingField = requiredFields.find((field) => !trimmed[field]);
    if (missingField) {
      setError("All product fields are required");
      return;
    }

    setError("");
    void onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            {mode === "create" ? "Add product" : "Update product"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            {mode === "create" ? "Create product" : "Edit product"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Product ID: {productId ?? "Will be generated on save"}
          </p>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_16rem]">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>SKU</span>
              <input
                value={values.sku}
                onChange={(event) => updateField("sku", event.target.value)}
                type="text"
                placeholder="SKU-001"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Name</span>
              <input
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
                type="text"
                placeholder="Product name"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Category</span>
              <select
                value={values.categoryId}
                onChange={(event) => handleRootChange(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Sub-category</span>
              <select
                value={values.subCategoryId}
                onChange={(event) => handleSubChange(event.target.value)}
                disabled={!values.categoryId}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400 disabled:bg-gray-100"
              >
                <option value="">Select sub-category</option>
                {subCategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Sub sub-category</span>
              <select
                value={values.subSubCategoryId}
                onChange={(event) => updateField("subSubCategoryId", event.target.value)}
                disabled={!values.subCategoryId}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400 disabled:bg-gray-100"
              >
                <option value="">Select sub sub-category</option>
                {subSubCategories.map((subSubCategory) => (
                  <option key={subSubCategory._id} value={subSubCategory._id}>
                    {subSubCategory.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Composition</span>
              <input
                value={values.composition}
                onChange={(event) => updateField("composition", event.target.value)}
                type="text"
                placeholder="Cotton blend"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Color</span>
              <input
                value={values.color}
                onChange={(event) => updateField("color", event.target.value)}
                type="text"
                placeholder="Blue"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Width</span>
              <input
                value={values.width}
                onChange={(event) => updateField("width", event.target.value)}
                type="text"
                placeholder="44 in"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Weight</span>
              <input
                value={values.weight}
                onChange={(event) => updateField("weight", event.target.value)}
                type="text"
                placeholder="1.2 kg"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
              <span>Image</span>
              <input
                onChange={handleImageChange}
                type="file"
                accept="image/*"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white"
              />
            </label>
          </div>

          <div className="space-y-4">
            {preview ? (
              <div className="rounded-2xl border border-gray-200 p-3">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
                  Preview
                </p>
                <img
                  src={preview}
                  alt="Product preview"
                  className="h-56 w-full rounded-xl object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                Upload an image to see the preview.
              </div>
            )}

            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-900">Selection summary</p>
              <p className="mt-2">
                {selectedRoot?.name ?? "Category"} / {selectedSub?.name ?? "Sub-category"} /{" "}
                {findNode(subSubCategories, values.subSubCategoryId)?.name ?? "Sub sub-category"}
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mx-6 mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
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
            {isLoading ? "Saving..." : "Save product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

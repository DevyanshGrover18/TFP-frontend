"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { uploadProductImage } from "@/app/services/uploadsService";

export type CategoryNode = {
  _id: string;
  name: string;
  children?: CategoryNode[];
};

export type ProductSpecification = {
  key: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  color: string;
  colorCode: string;
  mainImage: string;
  gallery: string[];
};

export type ProductFormValues = {
  sku: string;
  name: string;
  colorCode: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  description: string;
  specifications: ProductSpecification[];
  media: {
    mainImage: string;
    gallery: string[];
  };
  variants: ProductVariant[];
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

type TabId = "basic" | "variants" | "specifications" | "media";

const MAX_IMAGE_SIZE_LABEL = "5 MB";

const tabs: Array<{ id: TabId; label: string; caption: string }> = [
  { id: "basic", label: "Basic Info", caption: "Core catalog data" },
  { id: "variants", label: "Variants", caption: "Color options" },
  {
    id: "specifications",
    label: "Specifications",
    caption: "Key/value details",
  },
  { id: "media", label: "Media", caption: "Images and galleries" },
];

const emptyValues: ProductFormValues = {
  sku: "",
  name: "",
  colorCode: "",
  categoryId: "",
  subCategoryId: "",
  subSubCategoryId: "",
  description: "",
  specifications: [],
  media: {
    mainImage: "",
    gallery: [],
  },
  variants: [],
};

function cloneInitialValues(
  initialValues?: Partial<ProductFormValues>,
): ProductFormValues {
  return {
    ...emptyValues,
    ...initialValues,
    specifications:
      initialValues?.specifications?.map((item) => ({ ...item })) ?? [],
    media: {
      ...emptyValues.media,
      ...initialValues?.media,
      gallery: [...(initialValues?.media?.gallery ?? [])],
    },
    variants: initialValues?.variants?.length
      ? initialValues.variants.map((variant) => ({
          id: variant.id ?? crypto.randomUUID(),
          sku: variant.sku ?? "",
          name: variant.name ?? "",
          color: variant.color ?? "",
          colorCode: variant.colorCode ?? "",
          mainImage: variant.mainImage ?? "",
          gallery: [...(variant.gallery ?? [])],
        }))
      : [],
  };
}

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

function ImageThumb({
  src,
  alt,
  onRemove,
  removable = true,
}: {
  src: string;
  alt: string;
  onRemove: () => void;
  removable?: boolean;
}) {
  return (
    <div className="relative h-24 overflow-hidden rounded-2xl border border-gray-200">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      {removable ? (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-gray-700 shadow-sm"
        >
          Remove
        </button>
      ) : null}
    </div>
  );
}

function UploadLoader({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      <span>{label}</span>
    </div>
  );
}

function updatePreviewEntry(
  current: Record<number, string>,
  index: number,
  preview: string | null,
) {
  if (preview) {
    return {
      ...current,
      [index]: preview,
    };
  }

  const next = { ...current };
  delete next[index];
  return next;
}

function updatePreviewListEntry(
  current: Record<number, string[]>,
  index: number,
  previews: string[],
) {
  if (previews.length) {
    return {
      ...current,
      [index]: previews,
    };
  }

  const next = { ...current };
  delete next[index];
  return next;
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
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [productMainPreview, setProductMainPreview] = useState<string | null>(
    null,
  );
  const [productGalleryPreviews, setProductGalleryPreviews] = useState<
    string[]
  >([]);
  const [variantMainPreviews, setVariantMainPreviews] = useState<
    Record<number, string>
  >({});
  const [variantGalleryPreviews, setVariantGalleryPreviews] = useState<
    Record<number, string[]>
  >({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues(cloneInitialValues(initialValues));
    setActiveTab("basic");
    setError("");
    setIsUploading(false);
    setProductMainPreview(null);
    setProductGalleryPreviews([]);
    setVariantMainPreviews({});
    setVariantGalleryPreviews({});
  }, [initialValues, isOpen]);

  const selectedRoot = useMemo(
    () =>
      categories.find((category) => category._id === values.categoryId) ?? null,
    [categories, values.categoryId],
  );
  const subCategories = selectedRoot?.children ?? [];
  const selectedSub = useMemo(
    () =>
      subCategories.find((category) => category._id === values.subCategoryId) ??
      null,
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

  const updateMediaField = (
    field: "mainImage" | "gallery",
    value: string | string[],
  ) => {
    setValues((current) => ({
      ...current,
      media: {
        ...current.media,
        [field]: value,
      },
    }));
  };

  const updateVariant = <K extends keyof ProductVariant>(
    index: number,
    field: K,
    value: ProductVariant[K],
  ) => {
    setValues((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant,
      ),
    }));
  };

  const handleSingleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    folder: string,
    setPreview: (preview: string | null) => void,
    apply: (image: string) => void,
  ) => {
    let previewUrl: string | null = null;

    try {
      const file = event.target.files?.[0];
      if (file) {
        previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setIsUploading(true);
        setError("");
        const image = await uploadProductImage(file, folder);
        apply(image);
        setPreview(null);
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
      }
    } catch (uploadError) {
      setPreview(null);
      setActiveTab("media");
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : `Each image must be ${MAX_IMAGE_SIZE_LABEL} or smaller`,
      );
    } finally {
      setIsUploading(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
    event.target.value = "";
  };

  const handleMultipleImagesChange = async (
    event: ChangeEvent<HTMLInputElement>,
    folder: string,
    setPreviews: (previews: string[]) => void,
    apply: (images: string[]) => void,
  ) => {
    const previewUrls: string[] = [];

    try {
      const files = Array.from(event.target.files ?? []);
      if (!files.length) {
        event.target.value = "";
        return;
      }

      previewUrls.push(...files.map((file) => URL.createObjectURL(file)));
      setPreviews(previewUrls);
      setIsUploading(true);
      setError("");
      const images = await Promise.all(
        files.map((file) => uploadProductImage(file, folder)),
      );

      if (images.length) {
        apply(images);
      }
      setPreviews([]);
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      previewUrls.length = 0;
    } catch (uploadError) {
      setPreviews([]);
      setActiveTab("media");
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : `Each image must be ${MAX_IMAGE_SIZE_LABEL} or smaller`,
      );
    } finally {
      setIsUploading(false);
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    }
    event.target.value = "";
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

  const addSpecification = () => {
    setValues((current) => ({
      ...current,
      specifications: [...current.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (
    index: number,
    field: keyof ProductSpecification,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      specifications: current.specifications.map(
        (specification, specificationIndex) =>
          specificationIndex === index
            ? { ...specification, [field]: value }
            : specification,
      ),
    }));
  };

  const removeSpecification = (index: number) => {
    setValues((current) => ({
      ...current,
      specifications: current.specifications.filter(
        (_, specificationIndex) => specificationIndex !== index,
      ),
    }));
  };

  const addVariant = () => {
    setValues((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          id: crypto.randomUUID(),
          sku: "",
          name: "",
          color: "",
          colorCode: "",
          mainImage: "",
          gallery: [],
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setValues((current) => ({
      ...current,
      variants: current.variants.filter(
        (_, variantIndex) => variantIndex !== index,
      ),
    }));
  };

  const handleSubmit = () => {
    if (isUploading) {
      setActiveTab("media");
      setError("Wait for image uploads to finish before saving");
      return;
    }

    const trimmedSpecifications = values.specifications
      .map((specification) => ({
        key: specification.key.trim(),
        value: specification.value.trim(),
      }))
      .filter((specification) => specification.key || specification.value);

    const incompleteSpecification = trimmedSpecifications.find(
      (specification) => !specification.key || !specification.value,
    );

    if (incompleteSpecification) {
      setActiveTab("specifications");
      setError("Each specification needs both a key and a value");
      return;
    }

    const trimmedVariants = values.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku.trim(),
      name: variant.name.trim(),
      color: variant.color.trim(),
      colorCode: variant.colorCode.trim(),
      mainImage: variant.mainImage.trim(),
      gallery: variant.gallery.map((image) => image.trim()).filter(Boolean),
    }));

    const trimmed: ProductFormValues = {
      sku: (values.sku ?? "").trim(),
      name: (values.name ?? "").trim(),
      colorCode: (values.colorCode ?? "").trim(),
      categoryId: (values.categoryId ?? "").trim(),
      subCategoryId: (values.subCategoryId ?? "").trim(),
      subSubCategoryId: (values.subSubCategoryId ?? "").trim(),
      description: (values.description ?? "").trim(),
      specifications: trimmedSpecifications,
      media: {
        mainImage: values.media.mainImage.trim(),
        gallery: values.media.gallery
          .map((image) => image.trim())
          .filter(Boolean),
      },
      variants: trimmedVariants,
    };

    if (
      !trimmed.name ||
      !trimmed.sku ||
      !trimmed.colorCode ||
      !trimmed.categoryId ||
      !trimmed.subCategoryId ||
      !trimmed.subSubCategoryId ||
      !trimmed.description
    ) {
      setActiveTab("basic");
      setError("Complete all required basic information fields");
      return;
    }

    if (!trimmed.media.mainImage) {
      setActiveTab("media");
      setError("A main product image is required");
      return;
    }

    const invalidVariant = trimmed.variants.find(
      (variant) =>
        !variant.name ||
        !variant.color ||
        !variant.colorCode ||
        !variant.mainImage,
    );

    if (invalidVariant) {
      setActiveTab("variants");
      setError(
        "Each variant requires name, color, color code, and a main image",
      );
      return;
    }

    setError("");
    void onSubmit(trimmed);
  };

  const renderBasicTab = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="space-y-2 text-sm font-medium text-gray-700">
        <span>Product name</span>
        <input
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          type="text"
          placeholder="Product name"
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-gray-700">
        <span>SKU / Article Number</span>
        <input
          value={values.sku}
          onChange={(event) => updateField("sku", event.target.value)}
          type="text"
          placeholder="ART-001"
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-gray-700">
        <span>Color code</span>
        <input
          value={values.colorCode}
          onChange={(event) => updateField("colorCode", event.target.value)}
          type="text"
          placeholder="#C1A37C"
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
        <span>Subcategory</span>
        <select
          value={values.subCategoryId}
          onChange={(event) => handleSubChange(event.target.value)}
          disabled={!values.categoryId}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400 disabled:bg-gray-100"
        >
          <option value="">Select subcategory</option>
          {subCategories.map((subcategory) => (
            <option key={subcategory._id} value={subcategory._id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-gray-700">
        <span>Sub-subcategory</span>
        <select
          value={values.subSubCategoryId}
          onChange={(event) =>
            updateField("subSubCategoryId", event.target.value)
          }
          disabled={!values.subCategoryId}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400 disabled:bg-gray-100"
        >
          <option value="">Select sub-subcategory</option>
          {subSubCategories.map((subSubCategory) => (
            <option key={subSubCategory._id} value={subSubCategory._id}>
              {subSubCategory.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
        <span>Description</span>
        <textarea
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={5}
          placeholder="Describe the product"
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
        />
      </label>
    </div>
  );

  const renderVariantsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Variants</h4>
          <p className="text-sm text-gray-500">
            Add variants only if this product needs separate color or media
            options.
          </p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="rounded-2xl flex items-center border cursor-pointer border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-4" /> Add variant
        </button>
      </div>

      {values.variants.length ? (
        values.variants.map((variant, index) => (
          <div key={variant.id} className="rounded-3xl border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                Variant {index + 1}
              </p>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="rounded-xl flex items-center border cursor-pointer border-gray-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4" /> Remove
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>SKU</span>
                <input
                  value={variant.sku}
                  onChange={(event) =>
                    updateVariant(index, "sku", event.target.value)
                  }
                  type="text"
                  placeholder="Variant name"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>Name</span>
                <input
                  value={variant.name}
                  onChange={(event) =>
                    updateVariant(index, "name", event.target.value)
                  }
                  type="text"
                  placeholder="Variant name"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>Color</span>
                <input
                  value={variant.color}
                  onChange={(event) =>
                    updateVariant(index, "color", event.target.value)
                  }
                  type="text"
                  placeholder="Beige"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>Color code</span>
                <input
                  value={variant.colorCode}
                  onChange={(event) =>
                    updateVariant(index, "colorCode", event.target.value)
                  }
                  type="text"
                  placeholder="#C1A37C"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
                />
              </label>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
          No variants yet.
        </div>
      )}
    </div>
  );

  const renderSpecificationsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            Specifications
          </h4>
          <p className="text-sm text-gray-500">
            Add any number of key/value product details.
          </p>
        </div>
        <button
          type="button"
          onClick={addSpecification}
          className="rounded-2xl border cursor-pointer flex items-center border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-4" /> Add specification
        </button>
      </div>

      {values.specifications.length ? (
        <div className="space-y-3">
          {values.specifications.map((specification, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-2xl border border-gray-200 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <input
                value={specification.key}
                onChange={(event) =>
                  updateSpecification(index, "key", event.target.value)
                }
                type="text"
                placeholder="Key"
                className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
              <input
                value={specification.value}
                onChange={(event) =>
                  updateSpecification(index, "value", event.target.value)
                }
                type="text"
                placeholder="Value"
                className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="rounded-2xl border cursor-pointer flex items-center border-gray-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4" /> Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
          No specifications yet. Add key/value pairs like width, composition, or
          finish.
        </div>
      )}
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900">Product media</h4>
        <p className="mt-1 text-sm text-gray-500">
          Upload the main image and gallery for the base product.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Maximum image size: {MAX_IMAGE_SIZE_LABEL} each.
        </p>

        <div className="mt-4 grid gap-4">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            <span>Main image</span>
            <input
              onChange={(event) =>
                void handleSingleImageChange(
                  event,
                  "thefabricpeople/products",
                  setProductMainPreview,
                  (image) => updateMediaField("mainImage", image),
                )
              }
              type="file"
              accept="image/*"
              className="w-full rounded-2xl border cursor-pointer border-gray-200 px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white"
            />
          </label>

          {values.media.mainImage ? (
            <ImageThumb
              src={values.media.mainImage}
              alt="Product main"
              onRemove={() => updateMediaField("mainImage", "")}
            />
          ) : null}
          {productMainPreview ? (
            <div>
              <ImageThumb
                src={productMainPreview}
                alt="Product main preview"
                onRemove={() => setProductMainPreview(null)}
                removable={false}
              />
              <UploadLoader label="Uploading image..." />
            </div>
          ) : null}

          <label className="space-y-2 text-sm font-medium text-gray-700">
            <span>Gallery</span>
            <input
              onChange={(event) =>
                void handleMultipleImagesChange(
                  event,
                  "thefabricpeople/products",
                  setProductGalleryPreviews,
                  (images) =>
                    updateMediaField("gallery", [
                      ...values.media.gallery,
                      ...images,
                    ]),
                )
              }
              type="file"
              accept="image/*"
              multiple
              className="w-full rounded-2xl border cursor-pointer border-gray-200 px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white"
            />
          </label>

          {values.media.gallery.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {values.media.gallery.map((image, index) => (
                <ImageThumb
                  key={`${image}-${index}`}
                  src={image}
                  alt={`Product gallery ${index + 1}`}
                  onRemove={() =>
                    updateMediaField(
                      "gallery",
                      values.media.gallery.filter(
                        (_, galleryIndex) => galleryIndex !== index,
                      ),
                    )
                  }
                />
              ))}
            </div>
          ) : null}
          {productGalleryPreviews.length ? (
            <div>
              <div className="grid gap-3 md:grid-cols-3">
                {productGalleryPreviews.map((image, index) => (
                  <ImageThumb
                    key={`product-gallery-preview-${index}`}
                    src={image}
                    alt={`Product gallery preview ${index + 1}`}
                    onRemove={() => {}}
                    removable={false}
                  />
                ))}
              </div>
              <UploadLoader label="Uploading images..." />
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Variant media</h4>
          <p className="mt-1 text-sm text-gray-500">
            Add variant-specific images only when variants are present.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Maximum image size: {MAX_IMAGE_SIZE_LABEL} each.
          </p>
        </div>

        {values.variants.length ? (
          values.variants.map((variant, index) => (
            <div
              key={`${variant.id}-media`}
              className="rounded-3xl border border-gray-200 p-4"
            >
              <p className="text-sm font-semibold text-gray-900">
                {variant.name || `Variant ${index + 1}`}
              </p>
              <div className="mt-4 grid gap-4">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Variant main image</span>
                  <input
                    onChange={(event) =>
                      void handleSingleImageChange(
                        event,
                        "thefabricpeople/products/variants",
                        (preview) =>
                          setVariantMainPreviews((current) =>
                            updatePreviewEntry(current, index, preview),
                          ),
                        (image) => updateVariant(index, "mainImage", image),
                      )
                    }
                    type="file"
                    accept="image/*"
                    className="w-full rounded-2xl border cursor-pointer border-gray-200 px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white"
                  />
                </label>

                {variant.mainImage ? (
                  <ImageThumb
                    src={variant.mainImage}
                    alt={`${variant.name || "Variant"} main`}
                    onRemove={() => updateVariant(index, "mainImage", "")}
                  />
                ) : null}
                {variantMainPreviews[index] ? (
                  <div>
                    <ImageThumb
                      src={variantMainPreviews[index]}
                      alt={`${variant.name || "Variant"} main preview`}
                      onRemove={() => {}}
                      removable={false}
                    />
                    <UploadLoader label="Uploading image..." />
                  </div>
                ) : null}

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Variant gallery</span>
                  <input
                    onChange={(event) =>
                      void handleMultipleImagesChange(
                        event,
                        "thefabricpeople/products/variants",
                        (previews) =>
                          setVariantGalleryPreviews((current) =>
                            updatePreviewListEntry(current, index, previews),
                          ),
                        (images) =>
                          updateVariant(index, "gallery", [
                            ...variant.gallery,
                            ...images,
                          ]),
                      )
                    }
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full rounded-2xl border cursor-pointer border-gray-200 px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white"
                  />
                </label>

                {variant.gallery.length ? (
                  <div className="grid gap-3 md:grid-cols-3">
                    {variant.gallery.map((image, imageIndex) => (
                      <ImageThumb
                        key={`${image}-${imageIndex}`}
                        src={image}
                        alt={`${variant.name || "Variant"} gallery ${imageIndex + 1}`}
                        onRemove={() =>
                          updateVariant(
                            index,
                            "gallery",
                            variant.gallery.filter(
                              (_, galleryIndex) => galleryIndex !== imageIndex,
                            ),
                          )
                        }
                      />
                    ))}
                  </div>
                ) : null}
                {variantGalleryPreviews[index]?.length ? (
                  <div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {variantGalleryPreviews[index].map(
                        (image, imageIndex) => (
                          <ImageThumb
                            key={`variant-gallery-preview-${index}-${imageIndex}`}
                            src={image}
                            alt={`${variant.name || "Variant"} gallery preview ${imageIndex + 1}`}
                            onRemove={() => {}}
                            removable={false}
                          />
                        ),
                      )}
                    </div>
                    <UploadLoader label="Uploading images..." />
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
            No variant media needed because this product has no variants.
          </div>
        )}
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicTab();
      case "variants":
        return renderVariantsTab();
      case "specifications":
        return renderSpecificationsTab();
      case "media":
        return renderMediaTab();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
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

        <div className="grid md:grid-cols-[15rem_1fr]">
          <aside className="border-r border-gray-100 bg-gray-50 p-4">
            <div className="space-y-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm ring-1 ring-red-100"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      activeTab === tab.id
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {tab.label}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {tab.caption}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div
            className="overflow-y-auto p-6"
            style={{ maxHeight: "calc(92vh - 220px)" }}
          >
            {renderActiveTab()}
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
            className="rounded-2xl cursor-pointer border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isUploading}
            className="rounded-2xl cursor-pointer bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUploading
              ? "Uploading images..."
              : isLoading
                ? "Saving..."
                : "Save product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

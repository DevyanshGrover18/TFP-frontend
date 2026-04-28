"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import BadgesModal from "@/app/components/admin/products/BadgesModal";
import DeleteModal from "@/app/components/common/DeleteModal";
import ProductModal, {
  type CategoryNode,
  type ProductFormValues,
} from "@/app/components/admin/products/ProductModal";
import {
  createBadge,
  deleteBadge as deleteBadgeRecord,
  getAllBadges,
  type BadgeRecord,
} from "@/app/services/badgesService";
import { getAllCategories } from "@/app/services/categoriesService";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/app/services/productsService";
import type { ProductRecord } from "@/app/services/productsService";

type ProductModalState = {
  mode: "create" | "update";
  product: ProductRecord | null;
};

const RESERVED_BADGE_NAMES = new Set(["New", "Sold Out"]);

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ProductModalState>({
    mode: "create",
    product: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isSavingBadge, setIsSavingBadge] = useState(false);
  const [deletingBadgeId, setDeletingBadgeId] = useState<string | null>(null);

  const loadProducts = async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const data = (await getAllProducts()) as {
        products?: ProductRecord[];
        message?: string;
      };

      setProducts(data.products ?? []);
    } catch (loadError) {
      toast.error(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load products",
      );
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const loadCategories = async () => {
    const data = (await getAllCategories()) as {
      categories?: CategoryNode[];
      message?: string;
    };

    setCategories(data.categories ?? []);
  };

  const loadBadges = async () => {
    const data = await getAllBadges();
    setBadges(data.badges ?? []);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadCategories(), loadProducts(), loadBadges()]);
      } catch (initialError) {
        toast.error(
          initialError instanceof Error
            ? initialError.message
            : "Failed to load products",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialData();
  }, []);

  const openCreateModal = () => {
    setModalState({
      mode: "create",
      product: null,
    });
    setIsModalOpen(true);
  };

  const openUpdateModal = (product: ProductRecord) => {
    setModalState({
      mode: "update",
      product,
    });
    setIsModalOpen(true);
  };

  const initialValues = useMemo<Partial<ProductFormValues> | undefined>(() => {
    if (!modalState.product) {
      return undefined;
    }

    return {
      sku: modalState.product.sku,
      name: modalState.product.name,
      colorCode: modalState.product.colorCode,
      categoryId: modalState.product.categoryId,
      subCategoryId: modalState.product.subCategoryId,
      subSubCategoryId: modalState.product.subSubCategoryId,
      description: modalState.product.description,
      specifications: modalState.product.specifications,
      media: modalState.product.media,
      badges: modalState.product.badges,
      isSpecial: modalState.product.isSpecial ?? false,
      variants: modalState.product.variants,
       tags: modalState.product.tags ?? [],
    };
  }, [modalState.product]);

  const handleSaveProduct = async (values: ProductFormValues) => {
    setIsSubmitting(true);

    try {
      if (modalState.mode === "create") {
        await createProduct(values);
        toast.success("Product created successfully");
      } else if (modalState.product?._id) {
        const {product} = await updateProduct(modalState.product._id, values);
        console.log(product)
        toast.success("Product updated successfully");
      }

      setIsModalOpen(false);
      await loadProducts(true);
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProduct(deleteTarget._id);

      setDeleteTarget(null);
      toast.success("Product deleted successfully");
      await loadProducts(true);
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error ? deleteError.message : "Failed to delete product",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateBadge = async (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Badge name is required");
      return;
    }

    setIsSavingBadge(true);

    try {
      await createBadge(trimmedName);
      toast.success("Badge created successfully");
      await loadBadges();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create badge",
      );
    } finally {
      setIsSavingBadge(false);
    }
  };

  const handleDeleteBadge = async (badge: BadgeRecord) => {
    if (RESERVED_BADGE_NAMES.has(badge.name)) {
      toast.error("Reserved badges cannot be deleted");
      return;
    }

    setDeletingBadgeId(badge.id);

    try {
      await deleteBadgeRecord(badge.id);
      toast.success("Badge deleted successfully");
      await Promise.all([loadBadges(), loadProducts(true)]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete badge",
      );
    } finally {
      setDeletingBadgeId(null);
    }
  };


  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Products
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage product basics, variants, specifications, and image galleries in one flow.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Plus size={16} />
          Add product
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          Total Badges: {badges.length}
        </h2>
        <button
          type="button"
          onClick={() => setIsBadgesModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Customise Badges
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">All products</h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {products.length} items
          </span>
        </div>

        {isLoading ? (
          <p className="px-5 py-6 text-sm text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">ID</th>
                  <th className="px-5 py-4 font-medium">SKU</th>
                  <th className="px-5 py-4 font-medium">Image</th>
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Visibility</th>
                  <th className="px-5 py-4 font-medium">Color Code</th>
                  <th className="px-5 py-4 font-medium">Category Path</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-medium text-gray-900">{product.productId}</td>
                    <td className="px-5 py-4 text-gray-600">{product.sku}</td>
                    <td className="px-5 py-4">
                      {product.media?.mainImage ? (
                        <img
                          src={product.media.mainImage}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-gray-300 text-[11px] text-gray-400">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {product.isSpecial ? "Special only" : "Public"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{product.colorCode}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {[
                        product.categoryId.name,
                        product.subCategoryId.name,
                        product.subSubCategoryId.name,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openUpdateModal(product)}
                          className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="rounded-xl border border-gray-200 p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-gray-500">
            No products found. Add the first one to start the catalog.
          </div>
        )}

        {isRefreshing ? (
          <p className="px-5 pb-4 text-xs text-gray-400">Updating products...</p>
        ) : null}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        mode={modalState.mode}
        categories={categories}
        badges={badges}
        initialValues={initialValues}
        productId={modalState.product?.productId}
        isLoading={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
      />

      <BadgesModal
        isOpen={isBadgesModalOpen}
        badges={badges}
        isSaving={isSavingBadge}
        isDeletingId={deletingBadgeId}
        onClose={() => setIsBadgesModalOpen(false)}
        onCreate={handleCreateBadge}
        onDelete={handleDeleteBadge}
      />

      <DeleteModal
        isOpen={deleteTarget !== null}
        title="Delete product"
        description={`This will permanently delete ${deleteTarget?.name ?? "the selected product"}.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteProduct()}
      />
    </section>
  );
}

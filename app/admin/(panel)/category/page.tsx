"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import CategoryModal from "@/app/components/admin/category/CategoryModal";
import DeleteModal from "@/app/components/common/DeleteModal";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/app/services/categoriesService";

type CategoryNode = {
  _id: string;
  name: string;
  image: string;
  parentId: string | null;
  level: number;
  children?: CategoryNode[];
};

type ModalState = {
  mode: "create" | "update";
  category: CategoryNode | null;
  parentId: string | null;
  parentLabel: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    mode: "create",
    category: null,
    parentId: null,
    parentLabel: "Root category",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryNode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async (silent = false): Promise<CategoryNode[]> => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError("");

    try {
      
      const data = (await getAllCategories()) as {
        categories?: CategoryNode[];
        message?: string;
      };

      const nextCategories = data.categories ?? [];
      setCategories(nextCategories);
      return nextCategories;
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load categories",
      );
      return [];
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const openCreateModal = (parent: CategoryNode | null) => {
    setModalState({
      mode: "create",
      category: null,
      parentId: parent?._id ?? null,
      parentLabel: parent
        ? `${parent.name} (${
            parent.level === 1
              ? "Category"
              : parent.level === 2
                ? "Sub-category"
                : "Sub sub-category"
          })`
        : "Root category",
    });
    setIsModalOpen(true);
  };

  const openUpdateModal = (category: CategoryNode) => {
    setModalState({
      mode: "update",
      category,
      parentId: category.parentId,
      parentLabel: category.parentId ? "Existing parent" : "Root category",
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async ({
    name,
    image,
  }: {
    name: string;
    image: string;
  }) => {
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        image,
        parentId: modalState.parentId,
      };

      if (modalState.mode === "create") {
        await createCategory(payload);
      } else if (modalState.category?._id) {
        await updateCategory(modalState.category._id, payload);
      }

      setIsModalOpen(false);
      await loadCategories(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteCategory(deleteTarget._id);

      setDeleteTarget(null);
      await loadCategories(true);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete category",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const renderTree = (nodes: CategoryNode[]) => {
    return nodes.map((node) => {
      const hasChildren = (node.children?.length ?? 0) > 0;

      return (
        <details key={node._id} className="group">
          <summary className="flex cursor-pointer list-none items-start gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 transition hover:border-gray-300 hover:bg-gray-50">
            <span className="mt-2 text-gray-400 transition group-open:rotate-90">
              {hasChildren && (
                <ChevronRight size={16} />
              )}
            </span>

            <img
              src={node.image}
              alt={node.name}
              className="h-11 w-11 rounded-xl border border-gray-200 object-cover"
            />

            <div className="min-w-0 flex-1 flex justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {node.name}
                </p>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                  {node.level === 1
                    ? "Category"
                    : node.level === 2
                      ? "Sub-category"
                      : "Sub sub-category"}
                </span>
              </div>

              <div
                className="mt-3 flex flex-wrap gap-2"
                onClick={(event) => event.stopPropagation()}
              >
                {node.level < 3 ? (
                  <button
                    type="button"
                    onClick={() => openCreateModal(node)}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Add {node.level === 1 ? "sub category" : "sub sub category"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => openUpdateModal(node)}
                  className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(node)}
                  className="rounded-xl border border-gray-200 p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </summary>

          {hasChildren ? (
            <div className="mt-3 space-y-3 pl-6">
              {renderTree(node.children ?? [])}
            </div>
          ) : null}
        </details>
      );
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Category Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Use the accordion tree to create root categories, subcategories, and
            sub sub categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal(null)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Plus size={16} />
          Add category
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between px-1 pb-4">
          <h2 className="text-sm font-semibold text-gray-900">Tree</h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {categories.length} roots
          </span>
        </div>

        {isLoading ? (
          <p className="px-1 py-2 text-sm text-gray-500">
            Loading categories...
          </p>
        ) : categories.length > 0 ? (
          <div className="space-y-3">{renderTree(categories)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-500">
            No categories found. Add one to begin building the tree.
          </div>
        )}
        {isRefreshing ? (
          <p className="mt-3 px-1 text-xs text-gray-400">Updating tree...</p>
        ) : null}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        mode={modalState.mode}
        title={
          modalState.mode === "create" ? "Add category" : "Update category"
        }
        parentLabel={modalState.parentLabel}
        initialName={modalState.category?.name}
        initialImage={modalState.category?.image}
        submitLabel={modalState.mode === "create" ? "Create" : "Save changes"}
        isLoading={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCategory}
      />

      <DeleteModal
        isOpen={deleteTarget !== null}
        title="Delete category"
        description={`This will delete ${deleteTarget?.name ?? "the selected category"} and all nested subcategories below it.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteCategory()}
      />
    </section>
  );
}

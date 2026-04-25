"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import SpecialUserModal, {
  type SpecialUserFormValues,
} from "@/app/components/admin/special-users/SpecialUserModal";
import DeleteModal from "@/app/components/common/DeleteModal";
import {
  createSpecialUser,
  deleteSpecialUser,
  updateSpecialUser,
  getAllSpecialUsers,
  type SpecialUserRecord,
} from "@/app/services/specialUserService";
import { getAllUsers } from "@/app/services/userService";
import {
  getAllCategories,
  type Category,
} from "@/app/services/categoriesService";

type ModalState = {
  mode: "create" | "update";
  user: SpecialUserRecord | null;
};

export default function SpecialUsersPage() {
  const [users, setUsers] = useState<SpecialUserRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    mode: "create",
    user: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SpecialUserRecord | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const isEmailTaken = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const [usersData, specialUsersData] = await Promise.all([
      getAllUsers(),
      getAllSpecialUsers(),
    ]);

    const existsInUsers = (usersData.users ?? []).some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );
    const existsInSpecialUsers = (specialUsersData.users ?? []).some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );

    return existsInUsers || existsInSpecialUsers;
  };

  const loadData = async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const [usersData, categoriesData] = await Promise.all([
        getAllSpecialUsers(),
        getAllCategories(),
      ]);
      setUsers(usersData.users ?? []);
      setCategories(categoriesData.categories ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const initialValues = useMemo<
    Partial<SpecialUserFormValues> | undefined
  >(() => {
    if (!modalState.user) return undefined;
    return {
      name: modalState.user.name,
      email: modalState.user.email,
      status: modalState.user.status ?? true,
      allowedCategories: modalState.user.allowedCategories ?? [],
    };
  }, [modalState.user]);

  const openCreateModal = () => {
    setModalState({ mode: "create", user: null });
    setIsModalOpen(true);
  };

  const openUpdateModal = (user: SpecialUserRecord) => {
    setModalState({ mode: "update", user });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (values: SpecialUserFormValues) => {
    setIsSubmitting(true);

    try {
      if (modalState.mode === "create") {
        if (await isEmailTaken(values.email)) {
          throw new Error(
            "A user with this email already exists in users or special users.",
          );
        }
        await createSpecialUser(values);
        toast.success("Special user created successfully");
      } else if (modalState.user?.id) {
        const payload = {
          name: values.name,
          email: values.email,
          status: values.status,
          allowedCategories: values.allowedCategories,
          ...(values.password ? { password: values.password } : {}),
        };
        await updateSpecialUser(modalState.user.id, payload);
        toast.success("Special user updated successfully");
      }

      setIsModalOpen(false);
      await loadData(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await deleteSpecialUser(deleteTarget.id);
      setDeleteTarget(null);
      toast.success("Special user deleted successfully");
      await loadData(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Special User Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Special users
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage B2B client accounts and control which product categories each
            user can access.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Plus size={16} />
          Add special user
        </button>
      </div>
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            All special users
          </h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {users.length} items
          </span>
        </div>

        {isLoading ? (
          <p className="px-5 py-6 text-sm text-gray-500">
            Loading special users...
          </p>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Email</th>
                  <th className="px-5 py-4 font-medium">Categories</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4 text-gray-600">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {user.allowedCategories?.length ?? 0} categories
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          (user.status ?? true)
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {(user.status ?? true) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openUpdateModal(user)}
                          className="rounded-xl cursor-pointer border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          className="rounded-xl cursor-pointer border border-gray-200 p-2 text-red-600 hover:bg-red-50"
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
            No special users found. Create the first one from the admin panel.
          </div>
        )}

        {isRefreshing ? (
          <p className="px-5 pb-4 text-xs text-gray-400">Updating users...</p>
        ) : null}
      </div>

      <SpecialUserModal
        isOpen={isModalOpen}
        mode={modalState.mode}
        initialValues={initialValues}
        categories={categories}
        isLoading={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
      />

      <DeleteModal
        isOpen={deleteTarget !== null}
        title="Delete special user"
        description={`This will permanently delete ${deleteTarget?.name ?? "the selected user"}.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteUser()}
      />
    </section>
  );
}

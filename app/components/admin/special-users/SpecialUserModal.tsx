"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/app/services/categoriesService";

export type SpecialUserFormValues = {
  name: string;
  email: string;
  password: string;
  status: boolean;
  allowedCategories: string[];
};

type SpecialUserModalProps = {
  isOpen: boolean;
  mode: "create" | "update";
  initialValues?: Partial<SpecialUserFormValues>;
  categories: Category[];
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: SpecialUserFormValues) => void | Promise<void>;
};

const emptyValues: SpecialUserFormValues = {
  name: "",
  email: "",
  password: "",
  status: true,
  allowedCategories: [],
};

export default function SpecialUserModal({
  isOpen,
  mode,
  initialValues,
  categories,
  isLoading = false,
  onClose,
  onSubmit,
}: SpecialUserModalProps) {
  const [values, setValues] = useState<SpecialUserFormValues>(emptyValues);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setValues({
      ...emptyValues,
      ...initialValues,
      password: mode === "update" ? "" : (initialValues?.password ?? ""),
      allowedCategories: initialValues?.allowedCategories ?? [],
    });
    setError("");
  }, [initialValues, isOpen, mode]);

  if (!isOpen) return null;

  const updateField = <K extends keyof SpecialUserFormValues>(
    field: K,
    value: SpecialUserFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleCategory = (id: string) => {
    setValues((current) => ({
      ...current,
      allowedCategories: current.allowedCategories.includes(id)
        ? current.allowedCategories.filter((c) => c !== id)
        : [...current.allowedCategories, id],
    }));
  };

  const handleSubmit = () => {
    const trimmed = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
    };

    if (!trimmed.name || !trimmed.email) {
      setError("Name and email are required");
      return;
    }

    if (mode === "create" && !trimmed.password) {
      setError("Password is required");
      return;
    }

    if (trimmed.allowedCategories.length === 0) {
      setError("At least one category must be selected");
      return;
    }

    setError("");
    void onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl overflow-y-auto h-[90%] rounded-xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            {mode === "create" ? "Add special user" : "Update special user"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            {mode === "create" ? "Create special user" : "Edit special user"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage access and category permissions for this user.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            <span>Name</span>
            <input
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              type="text"
              placeholder="Enter full name"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700">
            <span>Email</span>
            <input
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              type="email"
              placeholder="user@example.com"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
            <span>
              Password{" "}
              {mode === "update" ? (
                <span className="text-gray-400">(leave blank to keep unchanged)</span>
              ) : null}
            </span>
            <input
              value={values.password}
              onChange={(e) => updateField("password", e.target.value)}
              type="password"
              placeholder={mode === "create" ? "Enter password" : "Optional"}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
            <span>Status</span>
            <select
              value={values.status ? "active" : "inactive"}
              onChange={(e) => updateField("status", e.target.value === "active")}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          {/* Category multiselect */}
          <div className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
            <span>Allowed categories</span>
            <div className="max-h-48 overflow-y-auto rounded-2xl border border-gray-200 px-4 py-3">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-400">No categories available</p>
              ) : (
                categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex cursor-pointer items-center gap-3 py-1.5"
                  >
                    <input
                      type="checkbox"
                      checked={values.allowedCategories.includes(cat._id)}
                      onChange={() => toggleCategory(cat._id)}
                      className="h-4 w-4 rounded accent-red-600"
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                ))
              )}
            </div>
            {values.allowedCategories.length > 0 ? (
              <p className="text-xs text-gray-400">
                {values.allowedCategories.length} categor
                {values.allowedCategories.length === 1 ? "y" : "ies"} selected
              </p>
            ) : null}
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
            {isLoading
              ? "Saving..."
              : mode === "create"
                ? "Create user"
                : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
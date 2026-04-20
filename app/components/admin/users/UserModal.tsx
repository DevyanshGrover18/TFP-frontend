"use client";

import { useEffect, useState } from "react";

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  status: boolean;
};

type UserModalProps = {
  isOpen: boolean;
  mode: "create" | "update";
  initialValues?: Partial<UserFormValues>;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
};

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  status: true,
};

export default function UserModal({
  isOpen,
  mode,
  initialValues,
  isLoading = false,
  onClose,
  onSubmit,
}: UserModalProps) {
  const [values, setValues] = useState<UserFormValues>(emptyValues);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues({
      ...emptyValues,
      ...initialValues,
      password: mode === "update" ? "" : initialValues?.password ?? "",
    });
    setError("");
  }, [initialValues, isOpen, mode]);

  if (!isOpen) {
    return null;
  }

  const updateField = <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
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

    setError("");
    void onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            {mode === "create" ? "Add user" : "Update user"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            {mode === "create" ? "Create user" : "Edit user"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage user details and account status.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            <span>Name</span>
            <input
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              type="text"
              placeholder="Enter full name"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700">
            <span>Email</span>
            <input
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              type="email"
              placeholder="user@example.com"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
            <span>
              Password {mode === "update" ? <span className="text-gray-400">(leave blank to keep unchanged)</span> : null}
            </span>
            <input
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              type="password"
              placeholder={mode === "create" ? "Enter password" : "Optional"}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
            <span>Status</span>
            <select
              value={values.status ? "active" : "inactive"}
              onChange={(event) => updateField("status", event.target.value === "active")}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
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
            {isLoading ? "Saving..." : mode === "create" ? "Create user" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

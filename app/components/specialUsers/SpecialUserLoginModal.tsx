"use client";

import { useEffect, useState } from "react";
import { storeSpecialUser } from "@/app/services/userSession";

type LoginFormValues = {
  email: string;
  password: string;
};

type SpecialUserLoginModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  externalError?: string; // API error passed from parent
  onClose: () => void;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
};

const emptyValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function SpecialUserLoginModal({
  isOpen,
  isLoading = false,
  externalError = "",
  onClose,
  onSubmit,
}: SpecialUserLoginModalProps) {
  const [values, setValues] = useState<LoginFormValues>(emptyValues);
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setValues(emptyValues);
    setValidationError("");
    setShowPassword(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = <K extends keyof LoginFormValues>(
    field: K,
    value: LoginFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    const trimmed = {
      email: values.email.trim(),
      password: values.password.trim(),
    };

    if (!trimmed.email) {
      setValidationError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmed.email)) {
      setValidationError("Enter a valid email address");
      return;
    }
    if (!trimmed.password) {
      setValidationError("Password is required");
      return;
    }

    setValidationError("");
    void onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  // Show API error if no local validation error
  const displayError = validationError || externalError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            B2B Portal
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            Sign in
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-4 px-6 py-6">
          <label className="block space-y-2 text-sm font-medium text-gray-700">
            <span>Email</span>
            <input
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              autoFocus
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-gray-700">
            <span>Password</span>
            <div className="relative">
              <input
                value={values.password}
                onChange={(e) => updateField("password", e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {displayError ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {displayError}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
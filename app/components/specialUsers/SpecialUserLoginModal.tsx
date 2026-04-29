"use client";

import { useEffect, useState } from "react";

type LoginFormValues = {
  email: string;
  password: string;
};

type SpecialUserLoginModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  externalError?: string;
  onClose: () => void;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
};

const emptyValues: LoginFormValues = { email: "", password: "" };

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
    if (!trimmed.email) { setValidationError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(trimmed.email)) { setValidationError("Enter a valid email address"); return; }
    if (!trimmed.password) { setValidationError("Password is required"); return; }
    setValidationError("");
    void onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  const displayError = validationError || externalError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Left panel — hidden on mobile */}
        <div
          className="relative hidden w-64 shrink-0 flex-col justify-between p-8 sm:flex"
          style={{ backgroundColor: "#1c1f2e" }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10"
            style={{ backgroundColor: "#c9a96e" }}
          />
          <div
            className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-10"
            style={{ backgroundColor: "#c9a96e" }}
          />

          <div className="relative">
            <div
              className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(201,169,110,0.15)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "#c9a96e" }}
            >
              B2B Portal
            </p>
            <h3
              className="text-2xl leading-snug text-white"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              Exclusive access for trade partners
            </h3>
          </div>

          <div className="relative space-y-4">
            {[
              { label: "Wholesale pricing", sub: "Tiered rates for all volumes" },
              { label: "Priority support", sub: "Dedicated account manager" },
              { label: "Early access", sub: "New collections before launch" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "#c9a96e" }}
                />
                <div>
                  <p className="text-xs font-medium text-white">{item.label}</p>
                  <p className="text-[11px] text-white/50">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — the form */}
        <div className="flex flex-1 flex-col">

          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-8">
            <div>
              {/* Show eyebrow on mobile only since left panel is hidden */}
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400 sm:hidden">
                B2B Portal
              </p>
              <h3 className="text-xl font-semibold text-gray-900">Sign in</h3>
              <p className="mt-0.5 text-sm text-gray-500">
                Access your trade account below.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 shrink-0 rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4 px-6 py-6 sm:px-8">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  value={values.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  type="email"
                  placeholder="user@example.com"
                  autoComplete="email"
                  autoFocus
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-stone-400 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  value={values.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-stone-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {displayError && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-5 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: "#1c1f2e" }}
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
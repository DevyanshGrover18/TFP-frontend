"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { createSpecialUserRequest } from "@/app/services/specialUserService";
import { toast } from "react-toastify";

type LoginFormValues = {
  email: string;
  password: string;
};

type RequestFormValues = {
  name: string;
  company: string;
  email: string;
};

const emptyLogin: LoginFormValues = { email: "", password: "" };
const emptyRequest: RequestFormValues = { name: "", company: "", email: "" };

function RequestModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RequestFormValues) => void;
}) {
  const [values, setValues] = useState<RequestFormValues>(emptyRequest);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setValues(emptyRequest);
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const update = <K extends keyof RequestFormValues>(field: K, value: string) =>
    setValues((c) => ({ ...c, [field]: value }));

  const handleSubmit = () => {
    if (!values.name.trim()) { setError("Name is required"); return; }
    if (!values.company.trim()) { setError("Company name is required"); return; }
    if (!values.email.trim()) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(values.email.trim())) { setError("Enter a valid email address"); return; }
    setError("");
    onSubmit(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" style={{ border: "1px solid #f0e0dc" }}>
        <div className="px-8 py-6" style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">Trade Access</p>
              <h3 className="mt-1 text-2xl italic text-white" style={{ fontFamily: "'Georgia', serif" }}>Request access</h3>
              <p className="mt-1 text-sm text-white/70">We'll review your application and get back to you.</p>
            </div>
            <button type="button" onClick={onClose} className="ml-4 cursor-pointer shrink-0 rounded-xl p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-4 px-8 py-6">
          {[
            { field: "name" as const, label: "Full Name", placeholder: "Your full name", type: "text" },
            { field: "company" as const, label: "Company Name", placeholder: "Your company", type: "text" },
            { field: "email" as const, label: "Business Email", placeholder: "you@company.com", type: "email" },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field} className="space-y-1.5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d94f4f]">{label}</label>
              <input
                value={values[field]}
                onChange={(e) => update(field, e.target.value)}
                type={type}
                placeholder={placeholder}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] px-4 py-3 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#ccc] focus:border-[#E8654A] focus:bg-white"
              />
            </div>
          ))}

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#d94f4f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-[#d94f4f]">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#f0e0dc] px-8 py-5">
          <button type="button" onClick={onClose} className="rounded-xl cursor-pointer border border-[#f0e0dc] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#888] transition-colors hover:border-[#E8654A] hover:text-[#d94f4f]">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="flex cursor-pointer items-center gap-2 rounded-xl px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}>
            Submit request
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SpecialUserLoginPage() {
  const router = useRouter();
  const { loginAsSpecialUser } = useAuth();

  const [values, setValues] = useState<LoginFormValues>(emptyLogin);
  const [validationError, setValidationError] = useState("");
  const [externalError, setExternalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const handleRequestSubmit = async (reqValues: RequestFormValues) => {
    try {
      const result = await createSpecialUserRequest(
        reqValues.name.trim(),
        reqValues.company.trim(),
        reqValues.email.trim(),
      );
      if (result.success) {
        toast.success("Your access request has been submitted! We'll review it shortly.");
        setIsRequestOpen(false);
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request");
    }
  };

  const updateField = <K extends keyof LoginFormValues>(field: K, value: LoginFormValues[K]) =>
    setValues((c) => ({ ...c, [field]: value }));

  const handleSubmit = async () => {
    const trimmed = { email: values.email.trim(), password: values.password.trim() };
    if (!trimmed.email) { setValidationError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(trimmed.email)) { setValidationError("Enter a valid email address"); return; }
    if (!trimmed.password) { setValidationError("Password is required"); return; }
    setValidationError("");
    setExternalError("");

    try {
      setIsLoading(true);
      await loginAsSpecialUser(trimmed.email, trimmed.password);
      router.push("/special");
      router.refresh();
    } catch (error) {
      setExternalError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = validationError || externalError;

  const perks = [
    {
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
      title: "Wholesale Pricing",
      description: "Access tiered pricing across all product categories with volume discounts.",
    },
    {
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
      title: "Dedicated Support",
      description: "A personal account manager for all your sourcing and bulk requirements.",
    },
    {
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
      title: "Exclusive Catalog",
      description: "Browse a curated selection of products available only to trade partners.",
    },
    {
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 4v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
      title: "Priority Fulfillment",
      description: "Your orders are processed first with guaranteed on-time delivery.",
    },
    {
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" /></svg>,
      title: "Early Access",
      description: "Be the first to see new collections before they go live to the public.",
    },
    {
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
      title: "Flexible MOQ",
      description: "Negotiate minimum order quantities tailored to your business needs.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero banner */}
      <div className="relative overflow-hidden px-6 py-20 text-white sm:px-12 lg:px-20" style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}>
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 left-1/2 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/60">B2B Trade Portal</p>
          <h1 className="text-4xl italic leading-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Georgia', serif" }}>
            Sourcing made<br />exclusive for you
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Join our network of trade partners and unlock pricing, catalogs, and support built for businesses that demand the best.
          </p>
          <button
            type="button"
            onClick={() => setIsRequestOpen(true)}
            className="mt-10 inline-flex items-center cursor-pointer gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] transition-transform hover:scale-105"
            style={{ color: "#E8426A" }}
          >
            Request special access
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Perks grid */}
      <div className="px-6 py-16 sm:px-12 lg:px-20" style={{ background: "#fdf5f3" }}>
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">What you get</p>
          <h2 className="mb-10 text-center text-3xl italic text-[#1a1a1a]" style={{ fontFamily: "'Georgia', serif" }}>Partner benefits</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="rounded-2xl bg-white p-6" style={{ border: "1px solid #f0e0dc" }}>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)", color: "#fff" }}>
                  {perk.icon}
                </div>
                <p className="mb-1.5 text-sm font-semibold text-[#1a1a1a]">{perk.title}</p>
                <p className="text-xs leading-5 text-[#888]">{perk.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-5 sm:flex-row" style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}>
            <div>
              <p className="text-sm font-semibold text-white">Not a partner yet?</p>
              <p className="mt-0.5 text-xs text-white/70">Applications are reviewed within 1–2 business days.</p>
            </div>
            <button type="button" onClick={() => setIsRequestOpen(true)} className="shrink-0 cursor-pointer rounded-full bg-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-90" style={{ color: "#E8426A" }}>
              Apply now
            </button>
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d94f4f]">Already a partner?</p>
          <h2 className="mb-8 text-center text-3xl italic text-[#1a1a1a]" style={{ fontFamily: "'Georgia', serif" }}>Sign in to your account</h2>

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm" style={{ border: "1px solid #f0e0dc" }}>
            <div className="space-y-4 px-8 py-8">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d94f4f]">Email</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ddd]">
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
                    onKeyDown={(e) => e.key === "Enter" && void handleSubmit()}
                    className="w-full rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] py-3 pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#ccc] focus:border-[#E8654A] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d94f4f]">Password</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ddd]">
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
                    onKeyDown={(e) => e.key === "Enter" && void handleSubmit()}
                    className="w-full rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] py-3 pl-10 pr-12 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#ccc] focus:border-[#E8654A] focus:bg-white"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ccc] transition-colors hover:text-[#d94f4f]" tabIndex={-1}>
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {displayError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#f0e0dc] bg-[#fdf5f3] px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#d94f4f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-[#d94f4f]">{displayError}</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#f0e0dc] px-8 py-5">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isLoading}
                className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" }}
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
                    Sign in to trade portal
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-xs text-[#aaa]">
                Don't have an account yet?{" "}
                <button type="button" onClick={() => setIsRequestOpen(true)} className="font-semibold cursor-pointer underline underline-offset-2 transition-colors hover:text-[#d94f4f]" style={{ color: "#E8654A" }}>
                  Request access
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <RequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}
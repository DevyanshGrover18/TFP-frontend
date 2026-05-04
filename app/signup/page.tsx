"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signupAsUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await signupAsUser(name, email, password);

      toast.success("Account created successfully");
      router.replace("/");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral px-4 py-12 text-primary sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-tertiary bg-white shadow-[0_30px_90px_rgba(26,27,46,0.08)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto flex max-w-md flex-col justify-center py-4">
            <p className="font-sans text-xs uppercase tracking-[0.32em] text-secondary">
              New Account
            </p>
            <h1 className="mt-4 font-serif text-4xl italic leading-tight text-primary">
              User Signup
            </h1>
            <p className="mt-3 font-sans text-sm leading-6 text-primary/65">
              Create your account to save selections and continue shopping.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary/55">
                  Full Name
                </span>
                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                    size={16}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-tertiary/70 bg-neutral py-3 pl-11 pr-4 font-sans text-sm text-primary outline-none transition focus:border-secondary"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary/55">
                  Email
                </span>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                    size={16}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-tertiary/70 bg-neutral py-3 pl-11 pr-4 font-sans text-sm text-primary outline-none transition focus:border-secondary"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary/55">
                  Password
                </span>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                    size={16}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    className="w-full rounded-2xl border border-tertiary/70 bg-neutral py-3 pl-11 pr-12 font-sans text-sm text-primary outline-none transition focus:border-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary transition hover:text-primary"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <button
                className="w-full rounded-2xl px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
                style={{
                  background:
                    "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 font-sans text-sm text-primary/65">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-secondary transition hover:text-primary"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden min-h-[480px] overflow-hidden lg:block">
          <img src="/tfb-side.png" alt="Side Panel" />
        </section>
      </div>
    </main>
  );
}

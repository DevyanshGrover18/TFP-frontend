"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginAsSpecialUser, loginAsUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      let loggedInAsSpecial = false;

      try {
        await loginAsSpecialUser(email, password);
        loggedInAsSpecial = true;
      } catch {
        await loginAsUser(email, password);
      }

      toast.success(
        loggedInAsSpecial
          ? "Signed in as special user"
          : "Signed in successfully",
      );
      router.replace("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral px-4 py-12 text-primary sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-tertiary bg-white shadow-[0_30px_90px_rgba(26,27,46,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden min-h-[680px] overflow-hidden bg-primary lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(186,164,133,0.4),transparent_35%),linear-gradient(135deg,#1a1b2e_0%,#252844_45%,#34385f_100%)]" />
          <div className="relative flex h-full flex-col justify-between p-10 text-neutral">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-tertiary">
                The Fabric People
              </p>
              <h1 className="mt-6 max-w-md font-serif text-5xl italic leading-tight">
                Sign in to your account and keep your sourcing flow moving.
              </h1>
            </div>

            <div className="max-w-sm space-y-4">
              {[
                "Track curated fabrics and product activity in one place.",
                "Keep checkout and saved selections ready across sessions.",
                "Use the same account across desktop and mobile.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full border border-tertiary/40 p-1.5">
                    <UserRound size={14} />
                  </div>
                  <p className="font-sans text-sm leading-6 text-neutral/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto flex max-w-md flex-col justify-center py-4">
            <p className="font-sans text-xs uppercase tracking-[0.32em] text-secondary">
              Welcome Back
            </p>
            <h2 className="mt-4 font-serif text-4xl italic leading-tight text-primary">
              Login
            </h2>
            <p className="mt-3 font-sans text-sm leading-6 text-primary/65">
              Enter your details to access your account or special catalog.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary/55">
                  Email
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
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
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-tertiary/70 bg-neutral py-3 pl-11 pr-12 font-sans text-sm text-primary outline-none transition focus:border-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary transition hover:text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-primary px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-neutral transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 font-sans text-sm text-primary/65">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-secondary transition hover:text-primary">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { Link } from "react-router-dom";
import { useRouter } from "@/hooks/useRouter";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { getSafePostLoginRedirect } from "@/services/authRedirect";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginAsSpecialUser, loginAsUser } = useAuth();

  const handleSubmit = async (event) => {
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
        loggedInAsSpecial ?
        "Signed in as special user" :
        "Signed in successfully"
      );
      const redirectTarget = getSafePostLoginRedirect(
        typeof window !== "undefined" ?
        new URLSearchParams(window.location.search).get("redirect") :
        null
      );
      router.replace(redirectTarget);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral px-4 py-12 text-primary sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-tertiary bg-white shadow-[0_30px_90px_rgba(26,27,46,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden min-h-[480px] overflow-hidden bg-primary lg:block">
          <div className="relative flex h-full flex-col justify-between text-neutral">
            <img src="/tfb-side.png" alt="Side Panel" />
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto flex max-w-md flex-col justify-center py-4">
            <div className="w-full flex justify-between items-center">
              <Link to="/"
                className="inline-flex w-fit items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-secondary transition hover:text-primary">
                
               <ArrowLeft size={15} /> Home
              </Link>
              <p className="font-sans text-xs uppercase tracking-[0.32em] text-secondary">
                Welcome Back
              </p>
            </div>
            <h2 className="mt-4 font-serif text-4xl italic leading-tight text-primary">
              Login
            </h2>
            <p className="mt-3 font-sans text-sm leading-6 text-primary/65">
              Enter your details to access your account or special catalog.
            </p>

            {error &&
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
                {error}
              </div>
            }

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary/55">
                  Email
                </span>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                    size={16} />
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-tertiary/70 bg-neutral py-3 pl-11 pr-4 font-sans text-sm text-primary outline-none transition focus:border-secondary" />
                  
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary/55">
                  Password
                </span>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                    size={16} />
                  
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-tertiary/70 bg-neutral py-3 pl-11 pr-12 font-sans text-sm text-primary outline-none transition focus:border-secondary" />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary transition hover:text-primary"
                    aria-label={
                    showPassword ? "Hide password" : "Show password"
                    }>
                    
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
                style={{
                  background:
                  "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)"
                }}>
                
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 font-sans text-sm text-primary/65">
              Don&apos;t have an account?{" "}
              <Link to="/signup"
                className="font-semibold text-secondary transition hover:text-primary">
                
                Create one
              </Link>
            </p>
            
          </div>
        </section>
      </div>
    </main>);

}
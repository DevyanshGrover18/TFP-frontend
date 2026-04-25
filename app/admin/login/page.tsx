"use client";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { loginAdmin } from "@/app/services/adminAuthService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    void loginAdmin(username, password)
      .then((res) => {
        if (res.success) {
          toast.success("Logged in sucessfully!");
          router.replace("/admin");
          router.refresh();
        } else {
          toast.error(res.message || "Invalid credentials.");
        }
      })
      .catch((err: unknown) => {
        toast.error(
          err instanceof Error ? err.message : "An error occurred while logging in.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* username */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Username
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition placeholder-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Protected area — authorised personnel only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import SpecialUserLoginModal from "@/app/components/specialUsers/SpecialUserLoginModal";

export default function SpecialAccessGate({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { sessionType, isSpecialSession, loginAsSpecialUser } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (sessionType === "user") {
      router.replace("/");
    }
  }, [hasMounted, router, sessionType]);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError("");
      await loginAsSpecialUser(values.email, values.password);
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasMounted) {
    return <div className="min-h-screen bg-[#fafaf5]" />;
  }

  if (isSpecialSession) {
    return <>{children}</>;
  }

  if (sessionType === "user") {
    return <div className="min-h-screen bg-[#fafaf5]" />;
  }

  return (
    <>
      <div className="min-h-screen bg-[#fafaf5]" />
      <SpecialUserLoginModal
        isOpen
        isLoading={isLoading}
        externalError={error}
        onClose={() => router.replace("/")}
        onSubmit={handleLogin}
      />
    </>
  );
}

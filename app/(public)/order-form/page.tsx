"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import RegistrationForm from "@/app/components/common/RegistrationForm";
import { buildLoginRedirectPath } from "@/app/services/authRedirect";
import { useAuth } from "@/app/context/AuthContext";

export default function OrderForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { sessionType } = useAuth();

  useEffect(() => {
    // Wait for session rehydration
    if (sessionType === null) return;

    if (sessionType !== "user" && sessionType !== "special") {
      router.replace(buildLoginRedirectPath(pathname));
    }
  }, [pathname, router, sessionType]);

  if (sessionType === null || (sessionType !== "user" && sessionType !== "special")) {
    return null;
  }

  return (
    <div>
      <div className="mx-auto my-8 w-2/3">
        <RegistrationForm />
      </div>
    </div>
  );
}

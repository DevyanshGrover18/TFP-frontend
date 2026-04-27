"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import RegistrationForm from "@/app/components/common/RegistrationForm";
import { buildLoginRedirectPath } from "@/app/services/authRedirect";
import { getStoredUser } from "@/app/services/userSession";

export default function OrderForm() {
  const router = useRouter();
  const pathname = usePathname();
  const user = getStoredUser();

  useEffect(() => {
    if (!user?.id) {
      router.replace(buildLoginRedirectPath(pathname));
    }
  }, [pathname, router, user?.id]);

  if (!user?.id) {
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

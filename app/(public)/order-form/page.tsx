"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegistrationForm from "@/app/components/common/RegistrationForm";
import { getStoredUser } from "@/app/services/userSession";

export default function OrderForm() {
  const router = useRouter();
  const user = getStoredUser();

  useEffect(() => {
    if (!user?.id) {
      router.replace("/login");
    }
  }, [router, user?.id]);

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

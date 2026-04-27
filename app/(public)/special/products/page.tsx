"use client";

import { Suspense } from "react";
import { ProductsPageDetails } from "../../products/page";
import SpecialAccessGate from "@/app/components/special/SpecialAccessGate";

export default function SpecialProductsPage() {
  return (
    <SpecialAccessGate>
      <Suspense>
        <ProductsPageDetails mode="special" />
      </Suspense>
    </SpecialAccessGate>
  );
}


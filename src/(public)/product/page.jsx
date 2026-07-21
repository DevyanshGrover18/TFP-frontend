import { Suspense } from "react";
import ProductPageClient from "@/components/product/ProductPageClient";

export default function ProductPage() {
  return (
    <Suspense
      fallback={
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
          <p className="text-sm text-[#6b6a70]">Loading product...</p>
        </div>
      }>
      
      <ProductPageClient />
    </Suspense>);

}
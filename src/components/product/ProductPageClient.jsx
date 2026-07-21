import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
"use client";

import { useEffect, useState } from "react";

import ProductDetail from "@/components/product/ProductDetail";
import {
  getProductByName } from

"@/services/productsService";

export default function ProductPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug") ?? "";

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setError("Missing product slug.");
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await getProductByName(slug);

        if (!response.success || !response.product) {
          throw new Error(response.message || "Product not found.");
        }

        setProduct(response.product);
      } catch (loadError) {
        setProduct(null);
        setError(
          loadError instanceof Error ?
          loadError.message :
          "Failed to load product."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-sm text-[#6b6a70]">Loading product...</p>
      </div>);

  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="max-w-lg rounded-3xl border border-[#ece7de] bg-[#fafaf5] p-10 text-center">
          <p className="text-sm text-[#6a4334]">
            {error || "Product not found."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-6 inline-flex items-center rounded-md border border-[#c8c5cd] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#01010f] transition hover:bg-white">
            
            Back to products
          </button>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="grow">
        <ProductDetail product={product} />
      </div>
    </div>);

}
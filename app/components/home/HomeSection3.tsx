"use client";

import { useAuth } from "@/app/context/AuthContext";
import { isProductAllowedForCategoryIds } from "@/app/services/catalogAccess";
import {
  getAllProducts,
  getProductDisplayColor,
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification,
  type ProductRecord,
} from "@/app/services/productsService";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../common/ProductCard";

const HomeSection3 = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isSpecialSession, specialUser } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const response = await getAllProducts();
        setProducts(response.products ?? []);
      } catch {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const allowedCategoryIds = useMemo(
    () =>
      isSpecialSession && specialUser?.allowedCategories.length
        ? new Set(specialUser.allowedCategories)
        : null,
    [isSpecialSession, specialUser],
  );

  const visibleProducts = useMemo(
    () =>
      products
        .filter((product) =>
          isProductAllowedForCategoryIds(product, allowedCategoryIds),
        )
        .slice(0, 6),
    [products, allowedCategoryIds],
  );

  useEffect(() => {
    if (currentIndex >= visibleProducts.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, visibleProducts.length]);

  const hasProducts = visibleProducts.length > 0;
  const activeProduct = hasProducts ? visibleProducts[currentIndex] : null;

  const showPrev = () => {
    if (!hasProducts) return;
    setCurrentIndex((prev) =>
      prev === 0 ? visibleProducts.length - 1 : prev - 1,
    );
  };

  const showNext = () => {
    if (!hasProducts) return;
    setCurrentIndex((prev) =>
      prev === visibleProducts.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-4xl bg-stone-200 lg:col-span-8">
          <Image
            src="/section3.jpg"
            alt="Featured fabric collection"
            width={1400}
            height={900}
            className="h-full min-h-80 w-full object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/45 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Editorial Selection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Fabric stories built around texture, color, and detail.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
              Pair the campaign image with a focused product highlight so the
              section feels structured and easy to scan.
            </p>
          </div>
        </div>

        <div className="rounded-4xl p-4 sm:p-5 lg:col-span-4">
          {loading ? (
            <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-3">
              <div className="aspect-square animate-pulse rounded-[22px] bg-stone-200" />
              <div className="space-y-3 px-2 pb-2 pt-4">
                <div className="h-3 w-20 animate-pulse rounded-full bg-stone-200" />
                <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200" />
              </div>
            </div>
          ) : hasError ? (
            <div className="rounded-[28px] border border-red-100 bg-red-50 px-5 py-8 text-center text-sm text-red-700">
              Unable to load the featured product right now.
            </div>
          ) : activeProduct ? (
            <div className="space-y-4">
              <ProductCard
                name={activeProduct.name}
                image={getProductPrimaryImage(activeProduct)}
                href={getProductHref(activeProduct)}
                badge={activeProduct.isNew ? "New" : undefined}
                category={activeProduct.categoryId}
                details={{
                  sku: activeProduct.sku,
                  composition: getProductSpecification(activeProduct, "composition"),
                  color: getProductDisplayColor(activeProduct),
                  width: getProductSpecification(activeProduct, "width"),
                  weight: getProductSpecification(activeProduct, "weight"),
                }}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {visibleProducts.map((product, index) => (
                    <button
                      key={product._id}
                      type="button"
                      aria-label={`Show product ${index + 1}`}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentIndex
                          ? "w-6 bg-stone-900"
                          : "w-2.5 bg-stone-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Previous product"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-xl text-stone-700 transition hover:bg-stone-50"
                  >
                    &#8249;
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next product"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 text-xl text-stone-700 transition hover:bg-stone-50"
                  >
                    &#8250;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border border-stone-200 bg-stone-50 px-5 py-8 text-center text-sm text-stone-600">
              No products are available for this section yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeSection3;

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
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../common/ProductCard";

const MAX_VISIBLE_PRODUCTS = 8;

const HomeCards = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
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
        .slice(0, MAX_VISIBLE_PRODUCTS),
    [products, allowedCategoryIds],
  );

  return (
    <section
      className="px-4 py-12 sm:px-6 lg:px-10"
      style={{ backgroundColor: "#f5f3ee" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2
            className="text-4xl italic text-stone-800 sm:text-5xl"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 400,
            }}
          >
            TFB Curations
          </h2>

          <a
            href="/products"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-stone-800"
          >
            View All Selections
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index}>
                <div
                  className="w-full animate-pulse rounded-2xl bg-stone-200"
                  style={{ aspectRatio: "3/4" }}
                />
                <div className="mt-3 space-y-1.5 px-0.5">
                  <div className="h-2.5 w-20 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
                  <div className="h-3 w-28 animate-pulse rounded-full bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
            Unable to load the fabric collection right now.
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-8 text-center text-sm text-stone-600">
            No products are available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                image={getProductPrimaryImage(product)}
                href={getProductHref(product)}
                badge={product.isNew ? "New" : undefined}
                details={{
                  sku: product.sku,
                  composition: getProductSpecification(product, "composition"),
                  color: getProductDisplayColor(product),
                  width: getProductSpecification(product, "width"),
                  weight: getProductSpecification(product, "weight"),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeCards;

"use client";

import { getAllProducts } from "@/app/services/productsService";
import React, { useEffect, useState } from "react";
import ProductCard from "../common/ProductCard";

type Product = {
  _id: string;
  productId: string;
  sku: string;
  name: string;
  image: string;
  categoryId: { _id: string; name: string };
  subCategoryId: { _id: string; name: string };
  subSubCategoryId: { _id: string; name: string };
  composition: string;
  color: string;
  width: string;
  weight: string;
  badge?: string;
  price?: string;
};

const MAX_VISIBLE_PRODUCTS = 8;

const HomeCards = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const response = await getAllProducts();
        const data = (response.products ?? []) as Product[];
        setProducts(data);
      } catch {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = products.slice(0, MAX_VISIBLE_PRODUCTS);

  return (
    <section
      className="px-4 py-12 sm:px-6 lg:px-10"
      style={{ backgroundColor: "#f5f3ee" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header row */}
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

          <button
            type="button"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-stone-800"
          >
            View All Selections
          </button>
        </div>

        {/* Grid */}
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
                image={product.image}
                badge={product.badge}
                price={product.price}
                priceUnit="yard"
                priceType="Wholesale"
                details={{
                  sku: product.sku,
                  composition: product.composition,
                  color: product.color,
                  width: product.width,
                  weight: product.weight,
                }}
                onClick={() => console.log("Go to product:", product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeCards;

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
    <section className="px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Collection
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-stone-900 sm:text-4xl">
              FOR FASHION FABRIC LOVERS
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
              Let's celebrate with great deals and exclusive new designs
            </p>
          </div>

          <div className="text-sm font-medium text-stone-500">
            {loading ? "Loading products..." : `${visibleProducts.length} items`}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-3"
              >
                <div className="aspect-square animate-pulse rounded-[22px] bg-stone-200" />
                <div className="space-y-3 px-2 pb-2 pt-4">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
            Unable to load the fabric collection right now.
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-[28px] border border-stone-200 bg-white px-6 py-8 text-center text-sm text-stone-600">
            No products are available for the home collection yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                image={product.image}
                category={product.categoryId?.name}
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

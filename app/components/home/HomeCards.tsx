"use client";

import { useAuth } from "@/app/context/AuthContext";
import { isProductVisibleForSession } from "@/app/services/catalogAccess";
import {
  getAllProducts,
  getProductDisplayColor,
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification,
  type ProductRecord,
} from "@/app/services/productsService";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../common/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_VISIBLE_PRODUCTS = 10;

const HomeCards = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isSpecialSession } = useAuth();

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

  const visibleProducts = useMemo(
    () =>
      products
        .filter((product) => isProductVisibleForSession(product, isSpecialSession))
        .slice(0, MAX_VISIBLE_PRODUCTS),
    [isSpecialSession, products],
  );

  const getCardsPerView = () => {
    if (typeof window === "undefined") return 5;
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 640) return 3;
    return 2;
  };

  const hasOverflow = visibleProducts.length > getCardsPerView();

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [visibleProducts]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement;
    const offset = card ? card.offsetWidth + 16 : el.clientWidth * 0.5;
    el.scrollBy({ left: direction === "right" ? offset : -offset, behavior: "smooth" });
  };

  return (
    <section
      className="px-4 py-12 sm:px-6 lg:px-10"
      style={{ backgroundColor: "#f5f3ee" }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2
            className="text-3xl italic text-stone-800 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400 }}
          >
            TFB Curations
          </h2>

          <div className="flex items-center gap-4">
            <a
              href="/products"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-stone-800 sm:text-[11px]"
            >
              View All
              <span className="hidden sm:inline"> Selections</span>
            </a>

            {/* Arrows — only when overflow exists */}
            {!loading && !hasError && hasOverflow && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 transition-all duration-200 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 transition-all duration-200 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden pb-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} data-card className="shrink-0">
                <div
                  className="w-full animate-pulse rounded-2xl bg-stone-200"
                  style={{ aspectRatio: "3/4" }}
                />
                <div className="mt-3 space-y-1.5 px-0.5">
                  <div className="h-2.5 w-16 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
                  <div className="h-3 w-24 animate-pulse rounded-full bg-stone-200" />
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
          <div
            ref={scrollRef}
            className="flex items-start gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleProducts.map((product) => (
              <div key={product._id} data-card className="shrink-0">
                <ProductCard
                  name={product.name}
                  image={getProductPrimaryImage(product)}
                  href={getProductHref(product)}
                  badges={product.badges}
                  isSpecial={product.isSpecial}
                  details={{
                    sku: product.sku,
                    composition: getProductSpecification(product, "composition"),
                    color: getProductDisplayColor(product),
                    width: getProductSpecification(product, "width"),
                    weight: getProductSpecification(product, "weight"),
                  }}
                />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Card widths: 2 visible on mobile, 3 on sm, 5 on lg */}
      <style>{`
        [data-card] {
          width: calc((100% - (2 * 1rem) - 2rem * 2) / 2);
          width: calc((100% - 8px - 3rem) / 2);
        }
        @media (min-width: 640px) {
          [data-card] { width: calc((100% - 32px - 3rem) / 3); }
        }
        @media (min-width: 1024px) {
          [data-card] { width: calc((100% - 64px - 5rem) / 5); }
        }
      `}</style>
    </section>
  );
};

export default HomeCards;
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
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex-1 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-800"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              New Arrivals
            </p>
            <div className="mx-auto mt-2 h-[1px] w-10 bg-gray-300" />
          </div>

          <div className="flex shrink-0 items-center gap-3 ml-4">
            <a
              href="/products"
              className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-gray-900 sm:block"
              style={{
                borderBottom: "1px solid #d1d5db",
                paddingBottom: "2px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              View All
            </a>

            {!loading && !hasError && hasOverflow && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={14} strokeWidth={2} />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden pb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 animate-pulse rounded-2xl bg-gray-100"
                style={{ aspectRatio: "3/4", width: "calc((100% - 64px) / 5)" }}
              />
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-sm text-red-400">
            Unable to load products right now.
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-8 text-center text-sm text-gray-400">
            No products are available yet.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex items-start gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      <style>{`
        [data-card] {
          width: calc((100% - 16px) / 2);
        }
        @media (min-width: 640px) {
          [data-card] { width: calc((100% - 32px) / 3); }
        }
        @media (min-width: 1024px) {
          [data-card] { width: calc((100% - 64px) / 5); }
        }
      `}</style>
    </section>
  );
};

export default HomeCards;
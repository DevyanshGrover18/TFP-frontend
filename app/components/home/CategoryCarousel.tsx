"use client";

import { getAllCategories } from "@/app/services/categoriesService";
import { type CatalogCategoryNode } from "@/app/services/catalogAccess";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoryCard from "../common/CategoryCard";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState<CatalogCategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const response = await getAllCategories();
        setCategories((response.categories ?? []) as CatalogCategoryNode[]);
      } catch {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.level === 1),
    [categories],
  );

  // Cards per view based on breakpoint
  const getCardsPerView = () => {
    if (typeof window === "undefined") return 5;
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 640) return 3;
    return 2;
  };

  // Whether there's actually overflow to scroll
  const hasOverflow = visibleCategories.length > getCardsPerView();

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
  }, [visibleCategories]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement;
    const offset = card ? card.offsetWidth + 16 : el.clientWidth * 0.5;
    el.scrollBy({ left: direction === "right" ? offset : -offset, behavior: "smooth" });
  };

  const staggerOffsets = ["mt-0", "mt-8", "mt-4", "mt-12", "mt-6"];

  // Card width: fills exactly N cards with 16px gaps between them
  // containerWidth = N * cardWidth + (N - 1) * 16
  // cardWidth = (containerWidth - (N-1)*16) / N
  // As a % of container: calc((100% - (N-1)*16px) / N)
  const cardWidthStyle = {
    mobile: "calc((100% - 16px) / 2)",       // 2 cards, 1 gap
    sm: "calc((100% - 32px) / 3)",            // 3 cards, 2 gaps
    lg: "calc((100% - 64px) / 5)",            // 5 cards, 4 gaps
  };

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-10" style={{ backgroundColor: "#f5f3ee" }}>
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
              Categories
            </p>
            <h2
              className="text-3xl italic text-stone-800 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400 }}
            >
              Signature Foundations
            </h2>
          </div>

          {/* Arrows: only shown when there are more cards than fit in view */}
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

        {/* Cards */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden pb-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 animate-pulse overflow-hidden rounded-2xl bg-stone-200"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
            Unable to load categories right now.
          </div>
        ) : visibleCategories.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-8 text-center text-sm text-stone-600">
            No categories are available yet.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex items-start gap-4 overflow-x-auto pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleCategories.map((category, index) => (
              <div
                key={category._id}
                data-card
                className={`shrink-0 cursor-pointer ${staggerOffsets[index % staggerOffsets.length]}`}
              >
                <Link href={`/products?category=${category._id}`}>
                  <CategoryCard name={category.name} image={category.image} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        [data-card] {
          width: ${cardWidthStyle.mobile};
        }
        @media (min-width: 640px) {
          [data-card] {
            width: ${cardWidthStyle.sm};
          }
        }
        @media (min-width: 1024px) {
          [data-card] {
            width: ${cardWidthStyle.lg};
          }
        }
      `}</style>
    </section>
  );
};

export default CategoryCarousel;
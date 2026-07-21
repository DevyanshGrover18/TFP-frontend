"use client";

import { getAllCategories } from "@/services/categoriesService";

import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoryCard from "../common/CategoryCard";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const response = await getAllCategories();
        setCategories(response.categories ?? []);
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
    [categories]
  );

  const getCardsPerView = () => {
    if (typeof window === "undefined") return 5;
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 640) return 3;
    return 2;
  };

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

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const offset = card ? card.offsetWidth + 16 : el.clientWidth * 0.5;
    el.scrollBy({
      left: direction === "right" ? offset : -offset,
      behavior: "smooth"
    });
  };

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex-1 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-800"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              
              Explore Our Categories
            </p>
            {/* thin underline centered */}
            <div className="mx-auto mt-2 h-[1px] w-10 bg-gray-300" />
          </div>

          {/* Scroll arrows — absolutely positioned to not shift heading */}
          {!loading && !hasError && hasOverflow &&
          <div className="flex shrink-0 gap-2 ml-4">
              <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30">
              
                <ChevronLeft size={14} strokeWidth={2} />
              </button>
              <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30">
              
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            </div>
          }
        </div>

        {/* Cards */}
        {loading ?
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) =>
          <div
            key={i}
            className="shrink-0 animate-pulse rounded-2xl bg-gray-100"
            style={{ aspectRatio: "3/4", width: "calc((100% - 64px) / 5)" }} />

          )}
          </div> :
        hasError ?
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-sm text-red-500">
            Unable to load categories right now.
          </div> :
        visibleCategories.length === 0 ?
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-8 text-center text-sm text-gray-400">
            No categories are available yet.
          </div> :

        <div
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
            {visibleCategories.map((category) =>
          <div
            key={category._id}
            data-card
            className="shrink-0">
            
                <Link to={`/products?category=${category._id}`}>
                  <CategoryCard name={category.name} image={category.image} />
                </Link>
              </div>
          )}
          </div>
        }
      </div>

      <style>{`
        [data-card] {
          width: calc((100% - 16px) / 2);
        }
        @media (min-width: 640px) {
          [data-card] {
            width: calc((100% - 32px) / 3);
          }
        }
        @media (min-width: 1024px) {
          [data-card] {
            width: calc((100% - 64px) / 5);
          }
        }
      `}</style>
    </section>);

};

export default CategoryCarousel;
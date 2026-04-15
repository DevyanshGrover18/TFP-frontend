"use client";

import { getAllCategories } from "@/app/services/categoriesService";
import React, { useEffect, useRef, useState } from "react";
import CategoryCard from "../common/CategoryCard";

type CategoryNode = {
  _id: string;
  name: string;
  image: string;
  parentId: string | null;
  level: number;
  children?: CategoryNode[];
};

const CategoryCarousel = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const response = await getAllCategories();
        const data = (response.categories ?? []) as CategoryNode[];
        setCategories(data.filter((category) => category.level === 1));
      } catch {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const offset = scrollRef.current.clientWidth * 0.9;
    scrollRef.current.scrollBy({
      left: direction === "right" ? offset : -offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Shop By Category
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-stone-900 sm:text-4xl">
              Explore fabric categories
            </h2>
          </div>

          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll categories left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-xl text-stone-700 shadow-sm transition hover:bg-stone-50"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll categories right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-xl text-stone-700 shadow-sm transition hover:bg-stone-50"
            >
              &#8250;
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[28px] border border-stone-200 bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-stone-200" />
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="h-5 w-28 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
            Unable to load categories right now.
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-[28px] border border-stone-200 bg-white px-6 py-8 text-center text-sm text-stone-600">
            No categories are available yet.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((category) => (
              <div
                key={category._id}
                className="min-w-[84%] sm:min-w-[48%] lg:min-w-[31%] xl:min-w-[23.5%]"
              >
                <CategoryCard
                  name={category.name}
                  image={category.image}
                  onClick={() => console.log("Go to category:", category._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryCarousel;

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

  // Stagger offsets to mimic the cascading layout in the image
  const staggerOffsets = ["mt-0", "mt-8", "mt-4", "mt-12"];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-10" style={{ backgroundColor: "#f5f3ee" }}>
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p
            className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400"
          >
            Categories
          </p>
          <h2
            className="text-4xl italic text-stone-800 sm:text-5xl"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400 }}
          >
            Signature Foundations
          </h2>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="min-w-[22%] overflow-hidden rounded-2xl bg-stone-200 animate-pulse"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
            Unable to load categories right now.
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-8 text-center text-sm text-stone-600">
            No categories are available yet.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex items-start gap-4 overflow-x-auto pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((category, index) => (
              <div
                key={category._id}
                className={`shrink-0 min-w-[78%] sm:min-w-[46%] lg:min-w-[22%] xl:min-w-[21%] ${
                  staggerOffsets[index % staggerOffsets.length]
                }`}
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
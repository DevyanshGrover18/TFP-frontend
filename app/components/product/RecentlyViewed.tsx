"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../common/ProductCard";
import {
  getProductDisplayColor,
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification,
  type ProductRecord,
} from "@/app/services/productsService";

const ITEMS_PER_VIEW = 4;

const RecentlyViewed = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const isSlider = products.length > ITEMS_PER_VIEW;
  const maxIndex = Math.max(0, products.length - ITEMS_PER_VIEW);

  useEffect(() => {
    const response = JSON.parse(
      sessionStorage.getItem("recentlyViewed") || "[]",
    );
    setProducts(response);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating, maxIndex],
  );

  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  const onDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStart);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -80) next();
    else if (dragOffset > 80) prev();
    setDragOffset(0);
  };

  if (products.length === 0) return null;

  const trackTranslateX = isSlider
    ? `calc(${-currentIndex * (100 / ITEMS_PER_VIEW)}% + ${isDragging ? dragOffset : 0}px)`
    : "0";

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-7 gap-4">
        <div>
          <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-1">
            Your History
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 leading-none">
            Recently Viewed
          </h2>
        </div>

        {isSlider && (
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm font-medium text-gray-800 tabular-nums">
              {currentIndex + 1}–
              {Math.min(currentIndex + ITEMS_PER_VIEW, products.length)}
              <span className="text-gray-400 font-normal">
                {" "}
                / {products.length}
              </span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                aria-label="Previous"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-800 transition-all duration-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8l4-4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                aria-label="Next"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-800 transition-all duration-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Viewport */}
      <div
        className="overflow-hidden -mx-1 px-1"
        onMouseDown={(e) => isSlider && onDragStart(e.clientX)}
        onMouseMove={(e) => isSlider && onDragMove(e.clientX)}
        onMouseUp={() => isSlider && onDragEnd()}
        onMouseLeave={() => isSlider && isDragging && onDragEnd()}
        onTouchStart={(e) => isSlider && onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => isSlider && onDragMove(e.touches[0].clientX)}
        onTouchEnd={() => isSlider && onDragEnd()}
      >
        {isSlider ? (
          /* Slider track */
          <div
            className="flex will-change-transform select-none"
            style={{
              width: `${(products.length / ITEMS_PER_VIEW) * 100}%`,
              transform: `translateX(${trackTranslateX})`,
              transition: isDragging
                ? "none"
                : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {products.map((product, i) => (
              <div
                key={product._id}
                className="px-2.5 box-border animate-fade-up"
                style={{
                  width: `${100 / products.length}%`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <ProductCard
                  name={product.name}
                  image={getProductPrimaryImage(product)}
                  href={getProductHref(product)}
                  details={{
                    sku: product.sku,
                    composition: getProductSpecification(
                      product,
                      "composition",
                    ),
                    color: getProductDisplayColor(product),
                    width: getProductSpecification(product, "width"),
                    weight: getProductSpecification(product, "weight"),
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Static grid (≤ 4 items) */
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <div
                key={product._id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard
                  name={product.name}
                  image={getProductPrimaryImage(product)}
                  href={getProductHref(product)}
                  details={{
                    sku: product.sku,
                    composition: getProductSpecification(
                      product,
                      "composition",
                    ),
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

      {/* Dot indicators */}
      {isSlider && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full border-none p-0 transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 bg-gray-900"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentlyViewed;
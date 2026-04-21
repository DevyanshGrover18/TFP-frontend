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

const ITEMS_DESKTOP = 4;
const ITEMS_MOBILE = 1;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
};

const RecentlyViewed = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const isMobile = useIsMobile();
  const itemsPerView = isMobile ? ITEMS_MOBILE : ITEMS_DESKTOP;
  const isSlider = products.length > itemsPerView;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  useEffect(() => {
    const response = JSON.parse(
      sessionStorage.getItem("recentlyViewed") || "[]",
    );
    setProducts(response);
  }, []);

  // Reset to first slide when viewport switches between mobile/desktop
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

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
    if (!isSlider) return;
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
    if (dragOffset < -60) next();
    else if (dragOffset > 60) prev();
    setDragOffset(0);
  };

  if (products.length === 0) return null;

  const trackTranslateX = isSlider
    ? `calc(${-currentIndex * (100 / itemsPerView)}% + ${isDragging ? dragOffset : 0}px)`
    : "0";

  return (
    <section className="mt-14">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between border-b border-[#ddd6cc] pb-3 mb-8 gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a736c] mb-1">
            Your History
          </p>
          <h2
            className="text-[1.6rem] font-bold italic leading-tight text-[#11100f]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Recently Viewed
          </h2>
        </div>

        {isSlider && (
          <div className="flex items-center gap-4 shrink-0 pb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9a9088] tabular-nums">
              {currentIndex + 1}–
              {Math.min(currentIndex + itemsPerView, products.length)}
              <span className="text-[#bbb5ae]"> / {products.length}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                aria-label="Previous"
                className="flex items-center justify-center w-8 h-8 rounded-[3px] border border-[#ddd6cc] bg-[#ede8e0] text-[#7a736c] transition-all duration-200 hover:border-[#171512] hover:bg-[#171512] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                aria-label="Next"
                className="flex items-center justify-center w-8 h-8 rounded-[3px] border border-[#ddd6cc] bg-[#ede8e0] text-[#7a736c] transition-all duration-200 hover:border-[#171512] hover:bg-[#171512] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Viewport ───────────────────────────────────────────────── */}
      <div
        className="overflow-hidden -mx-1 px-1"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={() => isDragging && onDragEnd()}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
      >
        {isSlider ? (
          <div
            className="flex will-change-transform select-none"
            style={{
              // Track is wide enough to hold all cards at current itemsPerView
              width: `${(products.length / itemsPerView) * 100}%`,
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
                className="px-2 box-border animate-fade-up"
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
                    composition: getProductSpecification(product, "composition"),
                    color: getProductDisplayColor(product),
                    width: getProductSpecification(product, "width"),
                    weight: getProductSpecification(product, "weight"),
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          // Static grid — desktop only, ≤ 4 products
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ── Dot indicators ─────────────────────────────────────────── */}
      {isSlider && (
        <div className="flex items-center justify-center gap-2 mt-7">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[3px] rounded-full border-none p-0 transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 bg-[#171512]"
                  : "w-[6px] bg-[#ddd6cc] hover:bg-[#b8b0a6]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentlyViewed;
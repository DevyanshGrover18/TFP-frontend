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
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../common/ProductCard";

const HomeSection3 = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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
        .slice(0, 6),
    [isSpecialSession, products],
  );

  useEffect(() => {
    if (currentIndex >= visibleProducts.length) setCurrentIndex(0);
  }, [currentIndex, visibleProducts.length]);

  const hasProducts = visibleProducts.length > 0;
  const activeProduct = hasProducts ? visibleProducts[currentIndex] : null;

  const showPrev = () => {
    if (!hasProducts) return;
    setCurrentIndex((prev) => (prev === 0 ? visibleProducts.length - 1 : prev - 1));
  };

  const showNext = () => {
    if (!hasProducts) return;
    setCurrentIndex((prev) => (prev === visibleProducts.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="px-4 pb-16 pt-2 sm:px-6 lg:px-10"
      style={{
        background: "linear-gradient(160deg, #fdf8f4 0%, #ffffff 50%, #fef2ea 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* ── Left: editorial image ── */}
          <div className="relative overflow-hidden rounded-4xl lg:col-span-8" style={{ background: "#e8d8c8" }}>
            <Image
              src="/section3.jpg"
              alt="Featured fabric collection"
              width={1400}
              height={900}
              className="w-full object-cover"
              style={{ aspectRatio: "4/3" }}
              priority={false}
            />

            {/* Layered overlays — warm left-side gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, rgba(10,6,2,0.62) 0%, rgba(10,6,2,0.18) 55%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(10,6,2,0.55) 0%, transparent 50%)",
              }}
            />
            {/* Subtle coral wash bottom-left */}
            <div
              className="absolute bottom-0 left-0 pointer-events-none"
              style={{
                width: "45%",
                height: "40%",
                background: "radial-gradient(ellipse at bottom left, rgba(200,69,26,0.2) 0%, transparent 70%)",
              }}
            />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 max-w-xl p-5 sm:p-8">
              {/* Eyebrow */}
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rotate-45 flex-shrink-0" style={{ background: "#e8783c" }} />
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.26em] sm:text-[11px]"
                  style={{ color: "#e8783c", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Editorial Selection
                </p>
              </div>

              <h2
                className="text-2xl leading-tight sm:text-3xl lg:text-4xl"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#f5ede4",
                  letterSpacing: "-0.02em",
                }}
              >
                Fabric stories built around texture, color, and detail.
              </h2>

              {/* Divider */}
              <div
                className="my-3 h-[1.5px] w-10 rounded-full"
                style={{ background: "linear-gradient(90deg, #c8451a, #e8783c)" }}
              />

              <p
                className="text-sm leading-relaxed sm:text-base"
                style={{
                  color: "rgba(245,237,228,0.7)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Pair the campaign image with a focused product highlight so the
                section feels structured and easy to scan.
              </p>
            </div>
          </div>

          {/* ── Right: product carousel ── */}
          <div className="lg:col-span-4">
            {loading ? (
              <div
                className="overflow-hidden rounded-[28px] p-3"
                style={{
                  border: "1px solid rgba(200,69,26,0.1)",
                  background: "#fff",
                }}
              >
                <div
                  className="aspect-square animate-pulse rounded-[22px]"
                  style={{ background: "linear-gradient(135deg, #f5ede4, #edddd0)" }}
                />
                <div className="space-y-3 px-2 pb-2 pt-4">
                  <div className="h-3 w-20 animate-pulse rounded-full" style={{ background: "#edddd0" }} />
                  <div className="h-4 w-full animate-pulse rounded-full" style={{ background: "#edddd0" }} />
                  <div className="h-4 w-2/3 animate-pulse rounded-full" style={{ background: "#edddd0" }} />
                </div>
              </div>
            ) : hasError ? (
              <div
                className="rounded-[28px] px-5 py-8 text-center text-sm"
                style={{
                  background: "rgba(200,69,26,0.05)",
                  border: "1px solid rgba(200,69,26,0.15)",
                  color: "#c8451a",
                }}
              >
                Unable to load the featured product right now.
              </div>
            ) : activeProduct ? (
              <div className="space-y-4">
                <div className="mx-auto w-full max-w-sm lg:max-w-none">
                  <ProductCard
                    name={activeProduct.name}
                    image={getProductPrimaryImage(activeProduct)}
                    href={getProductHref(activeProduct)}
                    badges={activeProduct.badges}
                    isSpecial={activeProduct.isSpecial}
                    category={activeProduct.categoryId}
                    details={{
                      sku: activeProduct.sku,
                      composition: getProductSpecification(activeProduct, "composition"),
                      color: getProductDisplayColor(activeProduct),
                      width: getProductSpecification(activeProduct, "width"),
                      weight: getProductSpecification(activeProduct, "weight"),
                    }}
                  />
                </div>

                {/* Dots + prev/next */}
                <div className="mx-auto flex w-full max-w-sm items-center justify-between lg:max-w-none">
                  {/* Dots */}
                  <div className="flex gap-2">
                    {visibleProducts.map((product, index) => (
                      <button
                        key={product._id}
                        type="button"
                        aria-label={`Show product ${index + 1}`}
                        onClick={() => setCurrentIndex(index)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          height: "5px",
                          width: index === currentIndex ? "24px" : "5px",
                          background:
                            index === currentIndex
                              ? "linear-gradient(90deg, #c8451a, #e8783c)"
                              : "rgba(200,69,26,0.2)",
                        }}
                      />
                    ))}
                  </div>

                  {/* Arrows */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={showPrev}
                      aria-label="Previous product"
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
                      style={{
                        border: "1px solid rgba(200,69,26,0.25)",
                        background: "#fff",
                        color: "#c8451a",
                        fontSize: "18px",
                        lineHeight: 1,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #c8451a, #e8783c)";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#c8451a";
                        e.currentTarget.style.borderColor = "rgba(200,69,26,0.25)";
                      }}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Next product"
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
                      style={{
                        border: "1px solid rgba(200,69,26,0.25)",
                        background: "#fff",
                        color: "#c8451a",
                        fontSize: "18px",
                        lineHeight: 1,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #c8451a, #e8783c)";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#c8451a";
                        e.currentTarget.style.borderColor = "rgba(200,69,26,0.25)";
                      }}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-[28px] px-5 py-8 text-center text-sm"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(200,69,26,0.1)",
                  color: "#7a6a60",
                }}
              >
                No products are available for this section yet.
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeSection3;
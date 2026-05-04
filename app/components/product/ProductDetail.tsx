"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { ProductRecord } from "@/app/services/productsService";
import RecentlyViewed from "./RecentlyViewed";
import { addCartItem } from "@/app/services/cartService";
import { buildLoginRedirectPath } from "@/app/services/authRedirect";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useCartCount } from "@/app/context/CartCountContext";
import { useAuth } from "@/app/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type VariantOption = {
  id: string;
  variantId: string | null;
  sku: string;
  name: string;
  color: string;
  colorCode: string;
  mainImage: string;
  gallery: string[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAllImages(product: ProductRecord): string[] {
  return Array.from(
    new Set(
      [
        product.media?.mainImage || product.image,
        ...(product.media?.gallery ?? []),
        ...product.variants.flatMap((v) => [v.mainImage, ...(v.gallery ?? [])]),
      ].filter(Boolean),
    ),
  );
}

function buildVariantOptions(product: ProductRecord): VariantOption[] {
  const base: VariantOption = {
    id: product._id,
    variantId: null,
    sku: product.sku,
    name: product.name,
    color: product.color,
    colorCode: product.colorCode,
    mainImage: product.media?.mainImage || product.image,
    gallery: product.media?.gallery ?? [],
  };

  const fromVariants: VariantOption[] = product.variants.map((v, i) => ({
    id: `${v.name}-${i}`,
    variantId: v.id ?? `${v.name}-${i}`,
    sku: v.sku,
    name: v.name,
    color: v.color,
    colorCode: v.colorCode,
    mainImage: v.mainImage,
    gallery: v.gallery,
  }));

  return [base, ...fromVariants];
}

// ─── VariantCard ──────────────────────────────────────────────────────────────

type VariantCardProps = {
  variant: VariantOption;
  isSelected: boolean;
  onClick: () => void;
};

const VariantCard = ({ variant, isSelected, onClick }: VariantCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 text-left transition-all"
    style={{
      borderRadius: "12px",
      border: isSelected
        ? "1.5px solid #E8654A"
        : "1px solid #f0e0dc",
      background: isSelected
        ? "linear-gradient(135deg, rgba(232,101,74,0.06) 0%, rgba(232,66,106,0.06) 100%)"
        : "#fdf5f3",
      padding: "10px 12px",
      boxShadow: isSelected ? "0 0 0 3px rgba(232,101,74,0.12)" : "none",
    }}
  >
    <div
      className="shrink-0 overflow-hidden"
      style={{
        width: 56,
        height: 56,
        borderRadius: "10px",
        border: "1px solid #f0e0dc",
        background: "#fff",
      }}
    >
      <img
        src={variant.mainImage}
        alt={variant.name}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="min-w-0 flex-1">
      <p
        className="truncate"
        style={{
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          fontSize: "14px",
          fontWeight: 600,
          color: "#1a1a1a",
        }}
      >
        {variant.name}
      </p>
      <p
        style={{
          fontSize: "10px",
          fontFamily: "'DM Sans', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "#d94f4f",
          marginTop: 2,
        }}
      >
        {variant.sku} · {variant.colorCode}
      </p>
    </div>
    {isSelected && (
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )}
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductDetail = ({ product }: { product: ProductRecord }) => {
  const allImages = useMemo(() => getAllImages(product), [product]);
  const variantOptions = useMemo(() => buildVariantOptions(product), [product]);
  const visibleBadges = useMemo(
    () => (Array.isArray(product.badges) ? product.badges.filter(Boolean) : []),
    [product.badges],
  );
  const isSoldOut = visibleBadges.includes("Sold Out");
  const router = useRouter();
  const pathname = usePathname();
  const { setCount } = useCartCount();
  const { isSpecialSession, specialUser, user } = useAuth();

  const [activeImage, setActiveImage] = useState(
    product.media?.mainImage || product.image || allImages[0] || "",
  );
  const [activeVariantId, setActiveVariantId] = useState(
    variantOptions[0]?.id ?? "",
  );
  const [activeVariantImages, setActiveVariantImages] = useState<string[]>(
    product.media?.gallery ?? [],
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (product.isSpecial && !isSpecialSession) {
      router.replace("/");
    }
  }, [isSpecialSession, product.isSpecial, router]);

  useEffect(() => {
    const oldList: ProductRecord[] = JSON.parse(
      sessionStorage.getItem("recentlyViewed") || "[]",
    );
    const filtered = oldList.filter((p) => p._id !== product._id);
    const newList = [product, ...filtered].slice(0, 10);
    sessionStorage.setItem("recentlyViewed", JSON.stringify(newList));
  }, [product]);

  const selectedVariant =
    variantOptions.find((variant) => variant.id === activeVariantId) ??
    variantOptions[0];

  if (product.isSpecial && !isSpecialSession) {
    return null;
  }

  const handleAddToCart = async () => {
    if (isSoldOut) {
      toast.error("This product is sold out.");
      return;
    }

    const activeUserId = user?.id ?? specialUser?.id;

    if (!activeUserId) {
      toast.error("Please sign in to add items to your cart.");
      router.push(buildLoginRedirectPath(pathname));
      return;
    }

    try {
      setIsAddingToCart(true);
      const response = await addCartItem({
        productId: product._id,
        variantId: selectedVariant?.variantId ?? null,
      });
      toast.success(response.message ?? "Item added to cart");
      setCount((prev) => prev + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to add item to cart.",
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-6 pb-24">

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <nav
          className="flex items-center flex-wrap gap-2 my-8 sm:my-10"
          style={{
            fontSize: "10px",
            fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontWeight: 600,
            color: "#bbb",
          }}
        >
          <Link
            href="/"
            style={{ color: "#bbb", transition: "color 0.2s" }}
            className="hover:text-[#d94f4f]"
          >
            Home
          </Link>
          <span style={{ color: "#f0e0dc" }}>/</span>
          <span style={{ color: "#bbb", cursor: "not-allowed" }}>
            {product.categoryId.name}
          </span>
          <span style={{ color: "#f0e0dc" }}>/</span>
          <span style={{ color: "#bbb", cursor: "not-allowed" }}>
            {product.subCategoryId.name}
          </span>
          <span style={{ color: "#f0e0dc" }}>/</span>
          <Link
            href={`/products?subsubcategory=${product.subSubCategoryId.id}`}
            style={{ color: "#d94f4f" }}
          >
            {product.subSubCategoryId.name}
          </Link>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 items-start">

          {/* LEFT — main image + thumbnails */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div
              className="overflow-hidden"
              style={{ borderRadius: "20px", background: "#fdf5f3", border: "1px solid #f0e0dc" }}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full object-cover hover:scale-105 transition-transform duration-300"
                style={{ aspectRatio: "1.05" }}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap">
              {activeVariantImages.map((src) => (
                <button
                  key={`${product._id}-${src}`}
                  onClick={() => setActiveImage(src)}
                  className="shrink-0 overflow-hidden transition-all duration-200"
                  style={{
                    borderRadius: "12px",
                    border: activeImage === src
                      ? "2px solid #E8654A"
                      : "1px solid #f0e0dc",
                    opacity: activeImage === src ? 1 : 0.65,
                    boxShadow: activeImage === src
                      ? "0 0 0 3px rgba(232,101,74,0.15)"
                      : "none",
                  }}
                >
                  <img
                    src={src}
                    alt={product.name}
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    style={{ width: 80, aspectRatio: "1.05" }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — product info */}
          <div className="pt-0 lg:pt-1">

            {/* Label + SKU */}
            <p
              style={{
                fontSize: "10px",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                fontWeight: 600,
                color: "#d94f4f",
              }}
            >
              Live Inventory · SKU {product.sku}
            </p>

            {/* Name */}
            <h1
              className="mt-2 leading-[0.92] tracking-[-0.03em]"
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              {product.name}
            </h1>

            {/* Variants */}
            <div className="mt-8">
              <p
                style={{
                  fontSize: "10px",
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  fontWeight: 600,
                  color: "#d94f4f",
                  borderBottom: "1px solid #f0e0dc",
                  paddingBottom: "10px",
                  marginBottom: "12px",
                }}
              >
                Colors &amp; Variants [{variantOptions.length}]
              </p>
              <div className="flex flex-col gap-2">
                {variantOptions.map((v) => (
                  <VariantCard
                    key={v.id}
                    variant={v}
                    isSelected={activeVariantId === v.id}
                    onClick={() => {
                      setActiveVariantId(v.id);
                      setActiveImage(v.mainImage);
                      setActiveVariantImages(v.gallery ?? []);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart || isSoldOut}
              className="mt-8 w-full flex items-center justify-center gap-2 transition-opacity"
              style={{
                borderRadius: "14px",
                padding: "14px 24px",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#fff",
                background: isSoldOut
                  ? "#ccc"
                  : "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
                border: "none",
                cursor: isSoldOut || isAddingToCart ? "not-allowed" : "pointer",
                opacity: isAddingToCart ? 0.75 : 1,
              }}
            >
              {isSoldOut ? (
                "Sold Out"
              ) : isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  Add to Cart
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>→</span>
                </>
              )}
            </button>

            {/* Badges */}
            {visibleBadges.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {visibleBadges.map((badge) => (
                  <span
                    key={badge}
                    style={{
                      borderRadius: "999px",
                      border: "1px solid #f0e0dc",
                      background: "#fdf5f3",
                      padding: "4px 12px",
                      fontSize: "9px",
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#d94f4f",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── SPECS + PRODUCT DETAILS ──────────────────────────────────── */}
        <section className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">

          {/* Specifications */}
          <div
            style={{
              borderRadius: "20px",
              background: "#fdf5f3",
              border: "1px solid #f0e0dc",
              padding: "28px 32px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                fontWeight: 600,
                color: "#d94f4f",
              }}
            >
              Technical Data
            </p>
            <h2
              className="mt-2"
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              Specifications
            </h2>
            <div
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8"
              style={{ gap: "20px 32px" }}
            >
              {product.specifications.map((row) => (
                <div
                  key={row.key}
                  style={{
                    borderBottom: "1px solid #f0e0dc",
                    paddingBottom: "14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#d94f4f",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {row.key}
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      fontFamily: "'Georgia', serif",
                      color: "#1a1a1a",
                      lineHeight: 1.4,
                    }}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div
            style={{
              borderRadius: "20px",
              background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
              padding: "28px 32px",
              color: "#fff",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Trade Notes
            </p>
            <h2
              className="mt-2"
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Product Details
            </h2>

            <p
              className="mt-5"
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                fontSize: "13px",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              &quot;{product.description || "No description available."}&quot;
            </p>

            <p
              className="mt-4"
              style={{
                fontSize: "12px",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Prepared for trade review with backend-managed imagery, variant
              references, and technical data for sourcing and bulk purchasing.
            </p>

            <div
              className="mt-6 flex items-center gap-2 pt-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
            >
              <span
                className="flex shrink-0 items-center justify-center"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontFamily: "'DM Sans', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Mill Certified Quality
              </span>
            </div>

            <p
              className="mt-3"
              style={{
                fontSize: "11px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Every bolt is inspected by our master weavers before leaving the
              facility. Wholesale pricing is calculated based on current volume
              and trade status.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <p
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Minimum order: on req.
              </p>
              <button
                type="button"
                className="flex items-center justify-center transition-colors"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.7)",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ?
              </button>
            </div>
          </div>
        </section>

        <RecentlyViewed />
      </div>
    </div>
  );
};

export default ProductDetail;
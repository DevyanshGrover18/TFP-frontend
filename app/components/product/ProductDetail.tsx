"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { ProductRecord } from "@/app/services/productsService";
import RecentlyViewed from "./RecentlyViewed";
import { addCartItem } from "@/app/services/cartService";
import { buildLoginRedirectPath } from "@/app/services/authRedirect";
import { getStoredUser } from "@/app/services/userSession";
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
    className={`flex w-full items-center gap-3 rounded-[3px] border bg-neutral px-3 py-2.5 text-left transition-all ${
      isSelected
        ? "border-[#171512] shadow-[0_0_0_1px_#171512]"
        : "border-[#e2dbd0] hover:border-[#b8b0a6]"
    }`}
  >
    <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xs border border-[#ddd5ca] bg-neutral">
      <img
        src={variant.mainImage}
        alt={variant.name}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-serif font-semibold text-[#171512] truncate">
        {variant.name}
      </p>
      <p className="text-xs uppercase tracking-[0.16em] text-[#9a9088]">
        {variant.sku} | {variant.colorCode}
      </p>
    </div>
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
  const { isSpecialSession } = useAuth();

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

    const user = getStoredUser();

    if (!user?.id) {
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
      setCount((prev) => prev + 1); // ← increment badge instantly
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
      className="bg-neutral text-[#171512] min-h-screen"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-6 pb-24">
        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <nav className="flex items-center flex-wrap gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-[#9a9088] my-8 sm:my-10">
          <Link
            href="/"
            className="hover:text-[#171512] transition-colors duration-200"
          >
            Home
          </Link>
          <span className="text-[#ddd6cc]">/</span>
          <span className="cursor-not-allowed">{product.categoryId.name}</span>
          <span className="text-[#ddd6cc]">/</span>
          <span className="cursor-not-allowed">
            {product.subCategoryId.name}
          </span>
          <span className="text-[#ddd6cc]">/</span>
          <Link
            href={`/products?subsubcategory=${product.subSubCategoryId.id}`}
            className="text-[#171512] hover:text-[#9a9088] transition-colors duration-200"
          >
            {product.subSubCategoryId.name}
          </Link>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-14 items-start">
          {/* LEFT — main image + thumbnails */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="overflow-hidden rounded-sm bg-[#e8e2d6]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full aspect-[1.05] hover:scale-105 object-cover transition-transform duration-300"
              />
            </div>
            {/* Thumbnails — horizontal scroll on mobile */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap scrollbar-hide">
              {activeVariantImages.map((src) => (
                <button
                  key={`${product._id}-${src}`}
                  onClick={() => setActiveImage(src)}
                  className={`shrink-0 overflow-hidden rounded-xs transition-all duration-200 ${
                    activeImage === src
                      ? "ring-2 ring-[#171512] ring-offset-1"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt={product.name}
                    className="w-20 sm:w-28 md:w-32 aspect-[1.05] object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — product info */}
          <div className="pt-0 lg:pt-1">
            {/* SKU */}
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#9a9088]">
              SKU {product.sku}
            </p>

            {/* Name */}
            <h1
              className="mt-2 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold italic leading-[0.92] tracking-[-0.03em] text-[#11100f]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {product.name}
            </h1>

            {/* Variants */}
            <div className="mt-7 sm:mt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a736c] border-b border-[#ddd6cc] pb-2.5">
                Colors &amp; Variants [{variantOptions.length}]
              </p>
              <div className="mt-3 flex flex-col gap-2">
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
              className="mt-7 sm:mt-8 w-full cursor-pointer rounded-sm bg-[#0d0c0b] px-6 py-3.5 text-[13px] font-semibold text-white flex items-center justify-center gap-2 hover:bg-[#2c2924] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSoldOut ? (
                "Sold Out"
              ) : isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  Add to cart
                  <span className="text-[15px] leading-none">→</span>
                </>
              )}
            </button>

            {/* Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {visibleBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#ddd0ba] bg-[#ede3d4] px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-[#8a7a67]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECS + PRODUCT DETAILS ──────────────────────────────────── */}
        <section className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
          {/* Specifications */}
          <div className="rounded-md shadow-md bg-white p-6 sm:p-8">
            <h2
              className="text-2xl sm:text-[1.6rem] font-bold text-[#11100f]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Specifications
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 sm:gap-y-6">
              {product.specifications.map((row) => (
                <div key={row.key}>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a9088] mb-1">
                    {row.key}
                  </p>
                  <p className="text-base sm:text-lg font-medium text-[#1b1916] leading-[1.4]">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-md border border-[#ddd6cc] bg-[#ede8e0] p-6 sm:p-8">
            <h2
              className="text-2xl sm:text-[1.6rem] font-bold italic text-[#11100f]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Product Details
            </h2>
            <div className="mt-5">
              <p
                className="text-[13px] italic leading-[1.8] text-[#4a443d]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                &quot;{product.description || "No description available."}&quot;
              </p>

              <p className="mt-4 text-[12px] leading-[1.7] text-[#6b635c]">
                Prepared for trade review with backend-managed imagery, variant
                references, and technical data for sourcing and bulk purchasing.
              </p>

              <div className="mt-6 flex items-center gap-2 border-t border-[#d8d0c4] pt-5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4a7c59]">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#4a443d]">
                  Mill Certified Quality
                </span>
              </div>

              <p className="mt-3 text-[11px] leading-[1.6] text-[#8a8179]">
                Every bolt is inspected by our master weavers before leaving the
                facility. Wholesale pricing is calculated based on current
                volume and trade status.
              </p>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-[10px] text-[#9a9088]">
                  Minimum order: on req.
                </p>
                <button
                  type="button"
                  className="h-6 w-6 rounded-full border border-[#c8c0b4] flex items-center justify-center text-[11px] text-[#9a9088] hover:bg-[#ddd6cc] transition-colors"
                >
                  ?
                </button>
              </div>
            </div>
          </div>
        </section>

        <RecentlyViewed />
      </div>
    </div>
  );
};

export default ProductDetail;

import React from "react";
import Link from "next/link";
import type { ProductCategoryRef } from "@/app/services/productsService";

type ProductCardProps = {
  name: string;
  image: string;
  href?: string;
  category?: string | ProductCategoryRef;
  badge?: string;
  badges?: string[];
  price?: string;
  priceUnit?: string;
  priceType?: string;
  details?: {
    sku?: string;
    composition?: string;
    weight?: string;
    color?: string;
    width?: string;
  };
  onClick?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  image,
  href,
  badge,
  badges,
  price,
  priceUnit = "yard",
  priceType = "Wholesale",
  details,
  onClick,
}) => {
  const detailRows = [
    { label: "Composition", value: details?.composition },
    { label: "Color", value: details?.color },
    { label: "Width", value: details?.width },
    { label: "Weight", value: details?.weight },
  ].filter((detail) => detail.value);
  const visibleBadges =
    badges?.filter(Boolean).length ? badges.filter(Boolean) : badge ? [badge] : [];

  const content = (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={name}
          className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {visibleBadges.length ? (
          <div className="absolute -rotate-45 -left-14 top-6 z-10 flex max-w-[70%] flex-wrap gap-2">
            {visibleBadges.map((item) => (
              <span
                key={item}
                className="w-72 text-center bg-red-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {detailRows.length > 0 && (
          <div
            className="absolute inset-0 flex translate-y-2 flex-col justify-end p-4 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(to top, rgba(30,25,20,0.82) 0%, rgba(30,25,20,0.45) 55%, transparent 100%)",
            }}
          >
            {details?.sku && (
              <p
                className="mb-3 text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {details.sku}
              </p>
            )}

            <div className="space-y-1.5">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span
                    className="shrink-0 text-[11px] uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="text-right text-[12px] font-medium"
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-3 flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                View Details
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
                →
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-0.5 px-0.5">
        {details?.sku && (
          <p
            className="text-[10px] tracking-wide"
            style={{ color: "#a09890", fontFamily: "Georgia, serif" }}
          >
            {details.sku}
          </p>
        )}

        <h3
          className="text-[15px] font-bold italic leading-snug text-stone-800"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          {name}
        </h3>

        {price && (
          <p className="text-[13px] text-stone-700">
            <span className="font-medium">{price}</span>
            <span className="text-stone-500"> / {priceUnit}</span>
            {priceType && (
              <span className="ml-1 text-stone-400">({priceType})</span>
            )}
          </p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block w-full cursor-pointer text-left transition-all duration-300"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full cursor-pointer text-left transition-all duration-300"
    >
      {content}
    </button>
  );
};

export default ProductCard;

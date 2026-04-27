"use client";

import Link from "next/link";
import {
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification,
  type ProductRecord,
} from "@/app/services/productsService";

export default function SpecialNewArrival({
  products,
}: {
  products: ProductRecord[];
}) {
  return (
    <section
      id="special-new-arrivals"
      className="px-6 py-12 md:px-12 md:py-20"
    >
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Curated for you
          </p>
          <h3
            className="text-3xl text-[#01010f] md:text-4xl"
            style={{ fontFamily: "Newsreader, Georgia, serif" }}
          >
            Exclusive New Arrivals
          </h3>
        </div>
        <a
          href="/special/products"
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-900"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          View Full Catalog →
        </a>
      </div>

      {products.length ? (
        <div className="grid grid-cols-1 gap-8 md:gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product._id}
              href={getProductHref(product)}
              className="group cursor-pointer"
            >
              <div className="relative mb-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-sm bg-[radial-gradient(circle_at_center,rgba(255,229,153,0.66)_0%,rgba(216,178,77,0.38)_26%,rgba(216,178,77,0.18)_50%,rgba(216,178,77,0.0)_76%)] blur-2xl"
                />
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#eeeee9]">
                  <img
                    src={getProductPrimaryImage(product)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute left-4 top-4 bg-[#01010f] px-3 py-1 text-[10px] uppercase tracking-widest text-white shadow-[0_0_18px_rgba(216,178,77,0.42),0_0_28px_rgba(255,236,168,0.28)]"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    New for You
                  </div>
                  <div className="absolute inset-0 flex items-end bg-[#01010f]/20 p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span
                      className="border-b border-white pb-0.5 text-[10px] uppercase tracking-widest text-white"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      View Details
                    </span>
                  </div>
                </div>
              </div>

              <h4
                className="mb-2 text-xl text-slate-900 transition-colors group-hover:text-[#6a5d3e] md:text-2xl"
                style={{ fontFamily: "Newsreader, Georgia, serif" }}
              >
                {product.name}
              </h4>
              <div className="flex items-center justify-between gap-4">
                <span
                  className="text-[10px] uppercase tracking-tighter text-slate-500"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {[getProductSpecification(product, "composition"), getProductSpecification(product, "weight")]
                    .filter(Boolean)
                    .join(" • ") || "Special selection"}
                </span>
                <span
                  className="text-sm text-[#01010f]"
                  style={{ fontFamily: "Newsreader, Georgia, serif" }}
                >
                  {product.sku}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-slate-200 bg-white px-6 py-12 text-sm text-slate-500">
          No special new arrivals are available yet.
        </div>
      )}
    </section>
  );
}

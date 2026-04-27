"use client";

import Link from "next/link";
import {
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification,
  type ProductRecord,
} from "@/app/services/productsService";

export default function SpecialRecommendation({
  products,
}: {
  products: ProductRecord[];
}) {
  return (
    <section className="overflow-hidden bg-[#f4f4ef] py-16 md:py-24">
      <div className="mb-10 px-6 md:px-12">
        <p
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Rare &amp; Limited Run Textiles
        </p>
        <h3
          className="text-3xl text-[#01010f] md:text-4xl"
          style={{ fontFamily: "Newsreader, Georgia, serif" }}
        >
          Reserved For You
        </h3>
      </div>

      {products.length ? (
        <div className="flex gap-6 overflow-x-auto px-6 pb-6 scrollbar-hide md:gap-8 md:px-12">
          {products.map((product) => (
            <Link
              key={product._id}
              href={getProductHref(product)}
              className="group min-w-[300px] flex-shrink-0 cursor-pointer md:min-w-[420px]"
            >
              <div className="relative mb-5">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-sm bg-[radial-gradient(circle_at_center,rgba(255,229,153,0.62)_0%,rgba(216,178,77,0.36)_26%,rgba(216,178,77,0.16)_50%,rgba(216,178,77,0.0)_76%)] blur-2xl"
                />
                <div className="relative aspect-video overflow-hidden rounded-sm bg-white">
                  <img
                    src={getProductPrimaryImage(product)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#01010f]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span
                      className="bg-white px-6 py-2 text-[10px] uppercase tracking-widest text-[#01010f]"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      Request Allocation
                    </span>
                  </div>
                </div>
              </div>

              <p
                className="mb-1 text-lg text-slate-900 transition-colors group-hover:text-[#6a5d3e] md:text-xl"
                style={{ fontFamily: "Newsreader, Georgia, serif" }}
              >
                {product.name}
              </p>
              <p
                className="text-[10px] uppercase tracking-widest text-slate-400"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {getProductSpecification(product, "composition") ||
                  getProductSpecification(product, "width") ||
                  product.sku}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-6 md:px-12">
          <div className="rounded-sm border border-slate-200 bg-white px-6 py-12 text-sm text-slate-500">
            No reserved special products are available yet.
          </div>
        </div>
      )}
    </section>
  );
}

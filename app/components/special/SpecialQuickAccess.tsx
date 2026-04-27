"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Bookmark,
  Folders,
  History,
  MoveUpRight,
  ShoppingBag,
} from "lucide-react";

type QuickAccessTile = {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  bg: string;
};

export default function SpecialQuickAccess({
  allowedCategoryCount,
  specialProductCount,
  totalVisibleProductCount,
}: {
  allowedCategoryCount: number;
  specialProductCount: number;
  totalVisibleProductCount: number;
}) {
  const tiles: QuickAccessTile[] = [
    {
      icon: <MoveUpRight />,
      label: "New Arrivals",
      value: `${specialProductCount}`,
      href: "#special-new-arrivals",
      bg: "bg-[#eeeee9]",
    },
    {
      icon: <Folders />,
      label: "Allowed Categories",
      value: `${allowedCategoryCount}`,
      href: "/special/products",
      bg: "bg-white border border-slate-200/60",
    },
    {
      icon: <ShoppingBag />,
      label: "Special Products",
      value: `${specialProductCount}`,
      href: "/special/products",
      bg: "bg-[#eeeee9]",
    },
    {
      icon: <Bookmark />,
      label: "Visible Products",
      value: `${totalVisibleProductCount}`,
      href: "/special/products",
      bg: "bg-white border border-slate-200/60",
    },
    {
      icon: <History />,
      label: "Browse Catalog",
      value: "Open",
      href: "/special/products",
      bg: "bg-[#eeeee9]",
    },
  ];

  return (
    <section className="bg-[#fafaf5] px-6 py-12 md:px-12 md:py-20">
      <p
        className="mb-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        Quick Access
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className={`aspect-square ${tile.bg} group flex cursor-pointer flex-col justify-between rounded-sm p-4 transition-colors duration-300 hover:bg-[#f4dfcf] md:p-6`}
          >
            <span className="self-end text-[#01010f] opacity-30 transition-opacity duration-300 group-hover:opacity-100">
              {tile.icon}
            </span>
            <div>
              <p
                className="text-lg text-[#01010f]"
                style={{ fontFamily: "Newsreader, Georgia, serif" }}
              >
                {tile.value}
              </p>
              <p
                className="mt-2 text-[10px] font-semibold uppercase tracking-widest leading-snug text-slate-700 md:text-[11px]"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {tile.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

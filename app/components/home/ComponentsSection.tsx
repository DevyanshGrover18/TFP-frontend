"use client";

import React from "react";
import {
  Scissors,
  Ribbon,
  SlidersHorizontal,
  Link2,
  PanelTop,
  Grid2X2,
  Banana,
  Heart,
  Layers,
  Cable,
  MapPin,
  Users,
  Package,
  Globe,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { label: "Elastics", icon: Scissors },
  { label: "Bows & Motifs", icon: Ribbon },
  { label: "Sliders", icon: SlidersHorizontal },
  { label: "Rings & Closers", icon: Link2 },
  { label: "Clips & Hangers", icon: PanelTop },
  { label: "Hooks & Eye", icon: Grid2X2 },
  { label: "Underwire & Boning", icon: Banana },
  { label: "Bra Cups", icon: Heart },
  { label: "Tapes & Ribbons", icon: Layers },
  { label: "TPU Tapes & Straps", icon: Cable },
];

const stats = [
  { icon: MapPin, value: "20+", label: "Years Experience" },
  { icon: Users, value: "500+", label: "Clients Served" },
  { icon: Package, value: "1000+", label: "Products" },
  { icon: Globe, value: "Pan India", label: "Presence" },
];

const ComponentsSection = () => {
  return (
    <section style={{ background: "#fdf0ef", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top: category icons */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p
          className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#1a1a1a" }}
        >
          Components that complete your creations
        </p>

        {/* Icon grid */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
          {categories.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3"
              style={{ width: "80px" }}
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white"
                style={{ border: "1px solid rgba(200,60,60,0.12)" }}
              >
                <Icon size={26} strokeWidth={1.4} style={{ color: "#d94f4f" }} />
              </div>
              <span
                className="text-center leading-tight"
                style={{ fontSize: "11px", color: "#444", fontWeight: 400 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/products?category=69f9d07b437c2de55787fd3a"
            className="inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm transition-all duration-200 hover:bg-[#d94f4f] hover:text-white border border-[#d94f4f] text-[#d94f4f] ">
            View All Products
            <span style={{ fontSize: "15px" }}>→</span>
          </Link>
        </div>
      </div>

      {/* Bottom: stats bar */}
      <div
        style={{
          borderTop: "1px solid rgba(200,60,60,0.12)",
          background: "#fae8e8",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className="flex items-center gap-4"
                style={{
                  paddingRight: i < stats.length - 1 ? "1.5rem" : 0,
                  borderRight:
                    i < stats.length - 1
                      ? "1px solid rgba(200,60,60,0.15)"
                      : "none",
                }}
              >
                <Icon
                  size={32}
                  strokeWidth={1.2}
                  style={{ color: "#d94f4f", flexShrink: 0 }}
                />
                <div>
                  <p
                    className="font-semibold leading-tight"
                    style={{ fontSize: "20px", color: "#1a1a1a" }}
                  >
                    {value}
                  </p>
                  <p style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComponentsSection;
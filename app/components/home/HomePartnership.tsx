// PartnershipExcellence.tsx
"use client";

import React from "react";
import { Package, Truck, ShieldCheck, Scissors } from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Package size={22} strokeWidth={1.4} />,
    title: "Bulk Pricing",
    description:
      "Tiered pricing structures designed for scale, from 50 yards to container loads.",
  },
  {
    icon: <Truck size={22} strokeWidth={1.4} />,
    title: "Priority Logistics",
    description:
      "Global white-glove shipping with real-time tracking and customs clearance assistance.",
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={1.4} />,
    title: "Certified Quality",
    description:
      "Every yard is multi-point inspected and OEKO-TEX certified where applicable.",
  },
  {
    icon: <Scissors size={22} strokeWidth={1.4} />,
    title: "Custom Weaving",
    description:
      "Proprietary dye matching and custom weave patterns for exclusive client collections.",
  },
];

const HomePartnership = () => {
  return (
    <section
      className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10"
      style={{
        background: "linear-gradient(160deg, #fdf8f4 0%, #ffffff 50%, #fef2ea 100%)",
        borderTop: "1px solid rgba(200, 69, 26, 0.08)",
        borderBottom: "1px solid rgba(200, 69, 26, 0.08)",
      }}
    >
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <div
              className="h-px flex-1 max-w-[48px]"
              style={{ background: "linear-gradient(to right, transparent, rgba(200,69,26,0.3))" }}
            />
            <div className="h-1.5 w-1.5 rotate-45 flex-shrink-0" style={{ background: "#c8451a" }} />
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "#c8451a", fontFamily: "'DM Sans', sans-serif" }}
            >
              Why Choose Us
            </p>
            <div className="h-1.5 w-1.5 rotate-45 flex-shrink-0" style={{ background: "#c8451a" }} />
            <div
              className="h-px flex-1 max-w-[48px]"
              style={{ background: "linear-gradient(to left, transparent, rgba(200,69,26,0.3))" }}
            />
          </div>

          <h2
            className="mb-4 text-3xl sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#1a0f08",
              letterSpacing: "0.01em",
              lineHeight: 1.15,
            }}
          >
            Partnership{" "}
            <span style={{ color: "#c8451a" }}>Excellence</span>
          </h2>

          <p
            className="mx-auto max-w-sm text-sm leading-relaxed sm:max-w-md"
            style={{
              color: "#7a6a60",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Providing a seamless infrastructure for global design houses and
            boutique ateliers alike.
          </p>

          {/* Underline accent */}
          <div className="mx-auto mt-4 h-[2px] w-12 rounded-full" style={{ background: "linear-gradient(90deg, #c8451a, #e8783c, transparent)" }} />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4"
            >
              {/* Icon container */}
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
                style={{
                  background: "rgba(200, 69, 26, 0.07)",
                  border: "1px solid rgba(200, 69, 26, 0.15)",
                  color: "#c8451a",
                }}
              >
                {feature.icon}
              </div>

              {/* Divider */}
              <div
                className="h-[1.5px] w-8 rounded-full transition-all duration-300 group-hover:w-12"
                style={{ background: "linear-gradient(90deg, #c8451a, #e8783c)" }}
              />

              {/* Title */}
              <h3
                className="text-xs font-semibold uppercase sm:text-[11px]"
                style={{
                  letterSpacing: "0.14em",
                  color: "#1a0f08",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-xs leading-relaxed sm:text-[13px]"
                style={{
                  color: "#7a6a60",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.7,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomePartnership;
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
    icon: <Package size={24} strokeWidth={1.4} />,
    title: "Bulk Pricing",
    description:
      "Tiered pricing structures designed for scale, from 50 yards to container loads.",
  },
  {
    icon: <Truck size={24} strokeWidth={1.4} />,
    title: "Priority Logistics",
    description:
      "Global white-glove shipping with real-time tracking and customs clearance assistance.",
  },
  {
    icon: <ShieldCheck size={24} strokeWidth={1.4} />,
    title: "Certified Quality",
    description:
      "Every yard is multi-point inspected and OEKO-TEX certified where applicable.",
  },
  {
    icon: <Scissors size={24} strokeWidth={1.4} />,
    title: "Custom Weaving",
    description:
      "Proprietary dye matching and custom weave patterns for exclusive client collections.",
  },
];

const HomePartnership = () => {
  return (
    <section
      className="px-4 py-14 sm:px-6 sm:py-20 lg:px-10"
      style={{ backgroundColor: "#1c2032" }}
    >
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center sm:mb-16">
          <h2
            className="mb-3 text-3xl italic text-stone-100 sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            Partnership Excellence
          </h2>
          <p
            className="mx-auto max-w-sm text-sm leading-relaxed text-stone-400 sm:max-w-md"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Providing a seamless infrastructure for global design houses and
            boutique ateliers alike.
          </p>
        </div>

        {/* Feature Grid — 2 col on mobile, 4 col on lg */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3">
              {/* Icon */}
              <div style={{ color: "#c9a96e" }}>{feature.icon}</div>

              {/* Title */}
              <h3
                className="text-xs font-semibold uppercase text-stone-200 sm:text-sm"
                style={{ letterSpacing: "0.12em" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-stone-400 sm:text-stone-300">
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
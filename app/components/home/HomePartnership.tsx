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
    icon: <Package size={28} strokeWidth={1.4} />,
    title: "Bulk Pricing",
    description:
      "Tiered pricing structures designed for scale, from 50 yards to container loads.",
  },
  {
    icon: <Truck size={28} strokeWidth={1.4} />,
    title: "Priority Logistics",
    description:
      "Global white-glove shipping with real-time tracking and customs clearance assistance.",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.4} />,
    title: "Certified Quality",
    description:
      "Every yard is multi-point inspected and OEKO-TEX certified where applicable.",
  },
  {
    icon: <Scissors size={28} strokeWidth={1.4} />,
    title: "Custom Weaving",
    description:
      "Proprietary dye matching and custom weave patterns for exclusive client collections.",
  },
];

const HomePartnership = () => {
  return (
    <section
      className="px-4 py-20 sm:px-6 lg:px-10"
      style={{ backgroundColor: "#1c2032" }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-4xl italic text-stone-100 sm:text-5xl"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            Partnership Excellence
          </h2>
          <p
            className="mx-auto max-w-md text-sm leading-relaxed text-stone-400"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Providing a seamless infrastructure for global design houses and
            boutique ateliers alike.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3">
              {/* Icon */}
              <div style={{ color: "#c9a96e" }}>{feature.icon}</div>

              {/* Title */}
              <h3
                className="text-sm font-semibold uppercase tracking-widest text-stone-200"
                style={{ letterSpacing: "0.12em" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-stone-300">
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
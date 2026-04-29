"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer
      className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10"
      style={{ backgroundColor: "#f5f3ee", borderTop: "1px solid #e2ddd6" }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Top Row — 2 col on mobile, 4 col on lg */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">

          {/* Brand Column — full width on mobile */}
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <h3
              className="text-base italic text-stone-800"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400 }}
            >
              The Fabric People
            </h3>
            <p className="max-w-[220px] text-xs leading-relaxed text-stone-500">
              The global standard for premium textile procurement. Sourcing only
              the finest fibers for the discerning creator.
            </p>
          </div>

          {/* Discover Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-800">
              Discover
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["About Us", "Sourcing Policy", "Wholesale Terms"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[11px] uppercase tracking-[0.1em] text-stone-500 transition-colors hover:text-stone-800"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-800">
              Client Care
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["Shipping & Logistics", "Contact Atelier", "Privacy"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[11px] uppercase tracking-[0.1em] text-stone-500 transition-colors hover:text-stone-800"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mailing List Column — full width on mobile */}
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-800">
              Mailing List
            </h4>
            <div
              className="flex items-center border-b border-stone-400"
              style={{ paddingBottom: "6px" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 bg-transparent text-[11px] text-stone-700 placeholder-stone-400 outline-none"
                style={{ fontFamily: "'Georgia', serif" }}
              />
              <button
                type="button"
                className="ml-2 text-stone-500 transition-colors hover:text-stone-800"
                aria-label="Subscribe"
              >
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div
          className="mt-10 pt-6 text-center sm:mt-12"
          style={{ borderTop: "1px solid #e2ddd6" }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
            © 2024 The Fabric People. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
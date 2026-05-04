"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[560px] overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-bl from-[#ea7939] via-[#fa645e] to-[#f13462]" />

      {/* Right White Diagonal Section */}
      <div
        className="absolute top-0 right-0 h-full w-full bg-white z-[1]"
        style={{
          clipPath: "polygon(72% 0%, 100% 0%, 100% 100%, 77% 100%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-[2] flex h-full py-6">
        {/* Left Content */}
        <div className="flex flex-col justify-center pl-20 pr-12 w-[65%] text-white">
          <h1 className="font-serif italic font-bold text-6xl leading-[1.05] tracking-[-0.02em] max-w-[560px]">
            Sourcing Excellence
            <br />
            Woven Into Every
            <br />
            Detail
          </h1>

          <p className="mt-8 text-2xl leading-[1.6] max-w-[520px] text-white/95">
            Your trusted partner for Innerwear, Swimwear, Activewear &
            Loungewear components and trims.
          </p>

          {/* CTA */}
          <div className="flex gap-5 mt-10">
            <button className="px-9 py-4 bg-white text-[#eb4b5e] font-semibold rounded-full hover:scale-105 transition-all">
              Explore Products →
            </button>

            <button className="px-9 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#eb4b5e] transition-all">
              Contact Us
            </button>
          </div>

          {/* Features */}
          <div className="flex gap-8 mt-10 text-[16px] text-white/95">
            <span>✦ Quality Assured</span>
            <span>◇ OEM/ODM</span>
            <span>⊙ On-Time Delivery</span>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative flex-1">
          {/* Diamond Frame */}
          <div className="absolute right-[45%] top-[41%] -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] bg-white/10 z-1" />
          <div className="absolute right-[47%] top-[49%] -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] bg-white/10 z-1" />
          <div className="absolute right-[45%] top-[59%] -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] bg-white/10 z-1" />
          <div className="absolute right-2/5 top-1/2 -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] border-[10px] border-white bg-[#F1ECE6] shadow-sm z-[3]">
            <div className="absolute inset-[-25%] rotate-45 scale-80 right-1">
              <img
                src="/hero-model.png"
                alt="Activewear model"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Decorative Dots */}
          <div className="absolute top-10 right-10 z-[4] grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-[4px] h-[4px] rounded-full bg-[#e4b9b2]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

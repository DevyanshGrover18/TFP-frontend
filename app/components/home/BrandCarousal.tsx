"use client";

const brands = [
  { name: "Kidley", logo: "/kidley.png" },
  { name: "Bodycare", logo: "/bodycare.png" },
  { name: "Saloni", logo: "/saloni.png" },
  { name: "Clovia", logo: "/clovia.png" },
  { name: "Tipsy", logo: "/tipsy.png" },
  { name: "Kalyani", logo: "/kalyani.png" },
  { name: "Blossom", logo: "/blossom.png" },
  { name: "Groversons", logo: "/groversons.jpg" },
  { name: "Nykaa", logo: "/nykaa.webp" },
  { name: "Pretty Secrets", logo: "" },
  { name: "Little Lacy", logo: "" },
  { name: "Sonari", logo: "" },
  { name: "Scan", logo: "" },
];

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="w-[200px] h-[80px] flex items-center justify-center flex-shrink-0 relative">
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="max-h-[45px] max-w-[160px] object-contain grayscale opacity-80 contrast-125 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ease-in-out"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const fallback = target.parentElement?.querySelector(
              ".brand-fallback"
            ) as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      ) : null}
      <span
        className="brand-fallback font-bold tracking-widest text-gray-400 uppercase text-xs text-center px-4 leading-tight"
        style={{ display: logo ? "none" : "flex" }}
      >
        {name}
      </span>
    </div>
  );
}

// One full set of logos as a self-contained track
function BrandTrack() {
  return (
    <div className="flex items-center flex-shrink-0 gap-x-4">
      {brands.map((brand, i) => (
        <BrandLogo key={i} name={brand.name} logo={brand.logo} />
      ))}
    </div>
  );
}

export default function BrandCarousel() {
  return (
    <section className="w-full bg-white border-y border-gray-100 py-6 flex items-center overflow-hidden">
      {/* Left: Trusted by text — 40% */}
      <div className="w-[40%] flex-shrink-0 flex flex-col items-start justify-center px-8 md:px-12 border-r border-gray-100 bg-white z-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 mb-1">
          Our partners
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
          Trusted by{" "}
          <span className="text-red-600"> brands</span>
        </h2>
        <p className="mt-2 text-sm text-gray-400 max-w-[220px]">
          We work with India's leading innerwear &amp; apparel labels.
        </p>
      </div>

      {/* Right: Infinite carousel — 60% */}
      <div className="w-[60%] overflow-hidden relative">
        {/* Subtle fade edges for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex items-center animate-marquee">
          <BrandTrack />
          <BrandTrack />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
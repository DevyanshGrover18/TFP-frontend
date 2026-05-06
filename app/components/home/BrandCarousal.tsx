"use client";

const brands = [
  {
    name: "Jockey",
    logo: "/jockey.png",
  },
  {
    name: "Zivame",
    logo: "/zivame.png",
  },
  {
    name: "Agoos",
    logo: "/agoos.png",
  },
  {
    name: "Amanté",
    logo: "/amante.png",
  },
  {
    name: "M&S",
    logo: "/m&s.png",
  },
  {
    name: "Triumph",
    logo: "/triumph.png",
  },
  {
    name: "Clovia",
    logo: "/clovia.png",
  },
];

// Fallback text component if image fails
function BrandLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="w-[120px] h-[40px] flex items-center justify-center flex-shrink-0">
      <img
        src={logo}
        alt={name}
        className="max-w-full max-h-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";

          const fallback = target.parentElement?.querySelector(
            ".brand-fallback"
          ) as HTMLElement;

          if (fallback) fallback.style.display = "inline";
        }}
      />

      <span
        className="brand-fallback font-semibold tracking-widest text-gray-700 uppercase text-sm hidden"
      >
        {name}
      </span>
    </div>
  );
}

const doubled = [...brands, ...brands];

export default function BrandCarousel() {
  return (
    <section className="w-full bg-white border-y border-gray-100 py-6 overflow-hidden">
      <div className="flex items-center animate-marquee whitespace-nowrap">
        {doubled.map((brand, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span className="px-10 flex items-center justify-center">
              <BrandLogo name={brand.name} logo={brand.logo} />
              <span
                className="font-semibold tracking-widest text-gray-700 uppercase text-sm hidden"
              >
                {brand.name}
              </span>
            </span>
            <span className="text-gray-200 text-lg select-none">|</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
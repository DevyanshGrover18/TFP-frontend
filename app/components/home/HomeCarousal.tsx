"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Slide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/banner1.jpg",
    eyebrow: "Cotton Atelier",
    title: "Premium Cotton Fabrics",
    subtitle: "Soft, breathable, and crafted for everyday comfort",
  },
  {
    id: 2,
    image: "/banner2.jpg",
    eyebrow: "Seasonal Edit",
    title: "New Season Collections",
    subtitle: "Explore the latest prints, textures, and weaves",
  },
  {
    id: 3,
    image: "/banner3.jpg",
    eyebrow: "Certified Quality",
    title: "Certified Quality Textiles",
    subtitle: "OEKO-TEX certified fabrics you can trust",
  },
];

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M13 4l-6 6 6 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7 4l6 6-6 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HomeCarousal: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (nextIndex: number, dir: "left" | "right" = "right") => {
      if (animating) return;
      const target = (nextIndex + slides.length) % slides.length;
      if (target === current) return;
      setDirection(dir);
      setPrev(current);
      setAnimating(true);
      setCurrent(target);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 500);
    },
    [animating, current],
  );

  const next = useCallback(() => goTo(current + 1, "right"), [current, goTo]);
  const back = useCallback(() => goTo(current - 1, "left"), [current, goTo]);

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goTo(current + 1, "right");
    }, 4500);
  }, [current, goTo]);

  useEffect(() => {
    startAuto();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAuto]);

  const handleManual = (fn: () => void) => {
    fn();
    startAuto();
  };

  return (
    <div className="w-full select-none">
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ height: "92vh", maxHeight: "780px", minHeight: "500px" }}
      >
        {prev !== null && (
          <div
            key={`prev-${prev}`}
            className="absolute inset-0"
            style={{
              animation: `${direction === "right" ? "exitLeft" : "exitRight"} 0.7s cubic-bezier(0.77,0,0.18,1) forwards`,
            }}
          >
            <img
              src={slides[prev].image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.25) 50%, rgba(10,9,8,0.1) 100%)",
              }}
            />
          </div>
        )}

        <div
          key={`curr-${current}`}
          className="absolute inset-0"
          style={{
            animation: animating
              ? `${direction === "right" ? "enterRight" : "enterLeft"} 0.7s cubic-bezier(0.77,0,0.18,1) forwards`
              : "none",
          }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.3) 45%, rgba(10,9,8,0.08) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,9,8,0.45) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-3xl px-8 pb-16 sm:px-12 lg:px-16 lg:pb-20">
          <p
            key={`eyebrow-${current}`}
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ animation: "fadeUp 0.5s ease 0.15s both" }}
          >
            {slides[current].eyebrow}
          </p>
          <h2
            key={`title-${current}`}
            className="mb-3 font-serif leading-tight text-white"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontStyle: "italic",
              fontWeight: 400,
              animation: "fadeUp 0.6s ease 0.2s both",
            }}
          >
            {slides[current].title}
          </h2>
          <p
            key={`sub-${current}`}
            className="mb-7 max-w-xl text-sm leading-relaxed sm:text-base"
            style={{
              color: "rgba(245,243,238,0.72)",
              animation: "fadeUp 0.6s ease 0.3s both",
            }}
          >
            {slides[current].subtitle}
          </p>
          <a
            key={`cta-${current}`}
            href="#"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-200 hover:gap-3"
            style={{
              animation: "fadeUp 0.6s ease 0.4s both",
              borderBottom: "1px solid rgba(201,169,110,0.6)",
              color: "#f5f3ee",
            }}
          >
            Explore Collection
            <span
              aria-hidden="true"
              style={{ color: "#c9a96e", fontSize: "14px", lineHeight: 1 }}
            >
              →
            </span>
          </a>
        </div>

        <button
          onClick={() => handleManual(back)}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all duration-200 z-10 cursor-pointer"
        >
          <ChevronLeft />
        </button>

        {/* Next button */}
        <button
          onClick={() => handleManual(next)}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all duration-200 z-10 cursor-pointer"
        >
          <ChevronRight />
        </button>

        <style>{`
          @keyframes enterRight {
            from { transform: translateX(60px); opacity: 0; }
            to   { transform: translateX(0);   opacity: 1; }
          }
          @keyframes enterLeft {
            from { transform: translateX(-60px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes exitLeft {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(-60px); opacity: 0; }
          }
          @keyframes exitRight {
            from { transform: translateX(0);   opacity: 1; }
            to   { transform: translateX(60px); opacity: 0; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() =>
                handleManual(() => goTo(i, i > current ? "right" : "left"))
              }
              aria-label={`Slide ${i + 1}`}
              className="h-[6px] rounded-full border-none p-0 cursor-pointer transition-all duration-300"
              style={{
                width: i === current ? "28px" : "6px",
                backgroundColor:
                  i === current ? "#ffffff" : "rgba(156,163,175,0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCarousal;

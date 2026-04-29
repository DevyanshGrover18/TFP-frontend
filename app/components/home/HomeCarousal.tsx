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
    title: "Majestic mountains",
    subtitle: "Find your peace in the heights",
  },
  {
    id: 2,
    image: "/banner2.jpg",
    eyebrow: "Seasonal Edit",
    title: "Golden coastlines",
    subtitle: "Where the ocean meets the shore",
  },
  {
    id: 3,
    image: "/banner3.jpg",
    eyebrow: "Certified Quality",
    title: "Ancient forests",
    subtitle: "Breathe in the wild unknown",
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
        style={{
          height: "min(92vh, 780px)",
          minHeight: "360px",
        }}
      >
        {/* Exiting slide */}
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

        {/* Current slide */}
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

        {/* Slide text content */}
        <div
          className="absolute bottom-0 left-0 right-0 max-w-3xl"
          style={{
            padding:
              "0 clamp(1rem, 6vw, 4rem) clamp(3rem, 6vw, 5rem)",
          }}
        >
          <p
            key={`eyebrow-${current}`}
            className="mb-3 font-semibold uppercase"
            style={{
              fontSize: "clamp(9px, 1.5vw, 11px)",
              letterSpacing: "0.3em",
              color: "rgba(245,243,238,0.8)",
              animation: "fadeUp 0.5s ease 0.15s both",
            }}
          >
            {slides[current].eyebrow}
          </p>
          <h2
            key={`title-${current}`}
            className="mb-3 font-serif leading-tight text-white"
            style={{
              fontSize: "clamp(1.6rem, 5.5vw, 3.5rem)",
              fontStyle: "italic",
              fontWeight: 400,
              animation: "fadeUp 0.6s ease 0.2s both",
            }}
          >
            {slides[current].title}
          </h2>
          <p
            key={`sub-${current}`}
            className="mb-7 max-w-xl leading-relaxed"
            style={{
              fontSize: "clamp(13px, 1.8vw, 16px)",
              color: "rgba(245,243,238,0.72)",
              animation: "fadeUp 0.6s ease 0.3s both",
            }}
          >
            {slides[current].subtitle}
          </p>
          <a
            key={`cta-${current}`}
            href="#"
            className="inline-flex items-center gap-2 font-semibold uppercase text-white transition-all duration-200 hover:gap-3"
            style={{
              fontSize: "clamp(9px, 1.4vw, 11px)",
              letterSpacing: "0.2em",
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
              &rarr;
            </span>
          </a>
        </div>

        {/* Prev button */}
        <button
          onClick={() => handleManual(back)}
          aria-label="Previous"
          className="absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm transition-all duration-200 hover:bg-black/50"
          style={{
            left: "clamp(8px, 2vw, 16px)",
            width: "clamp(36px, 5vw, 44px)",
            height: "clamp(36px, 5vw, 44px)",
          }}
        >
          <ChevronLeft />
        </button>

        {/* Next button */}
        <button
          onClick={() => handleManual(next)}
          aria-label="Next"
          className="absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm transition-all duration-200 hover:bg-black/50"
          style={{
            right: "clamp(8px, 2vw, 16px)",
            width: "clamp(36px, 5vw, 44px)",
            height: "clamp(36px, 5vw, 44px)",
          }}
        >
          <ChevronRight />
        </button>

        {/* Keyframe animations */}
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

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() =>
                handleManual(() =>
                  goTo(index, index > current ? "right" : "left"),
                )
              }
              aria-label={`Slide ${index + 1}`}
              className="cursor-pointer rounded-full border-none p-0 transition-all duration-300"
              style={{
                height: "clamp(4px, 1vw, 6px)",
                width: index === current ? "clamp(20px, 3vw, 28px)" : "clamp(4px, 1vw, 6px)",
                backgroundColor:
                  index === current ? "#ffffff" : "rgba(156,163,175,0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCarousal;
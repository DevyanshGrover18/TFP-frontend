"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/banner1.jpg",
    title: "Premium Cotton Fabrics",
    subtitle: "Soft, breathable, and crafted for everyday comfort",
  },
  {
    id: 2,
    image: "/banner2.jpg",
    title: "New Season Collections",
    subtitle: "Explore the latest prints, textures, and weaves",
  },
  {
    id: 3,
    image: "/banner3.jpg",
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
      {/* Main carousel */}
      <div className="relative w-full h-120 overflow-hidden bg-black">
        {/* Previous slide (exit animation) */}
        {prev !== null && (
          <img
            key={`prev-${prev}`}
            src={slides[prev].image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              animation: `${direction === "right" ? "exitLeft" : "exitRight"} 0.5s ease forwards`,
            }}
          />
        )}

        {/* Current slide (enter animation) */}
        <img
          key={`curr-${current}`}
          src={slides[current].image}
          alt={slides[current].title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: animating
              ? `${direction === "right" ? "enterRight" : "enterLeft"} 0.5s ease forwards`
              : "none",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 px-10 pb-10">
          <h2
            key={`title-${current}`}
            className="text-3xl font-bold text-white mb-1 leading-tight"
            style={{ animation: "fadeUp 0.5s ease 0.15s both" }}
          >
            {slides[current].title}
          </h2>
          <p
            key={`sub-${current}`}
            className="text-white/65 text-sm"
            style={{ animation: "fadeUp 0.5s ease 0.25s both" }}
          >
            {slides[current].subtitle}
          </p>
        </div>

        {/* Prev button */}
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

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
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

      {/* Dots */}
    </div>
  );
};

export default HomeCarousal;

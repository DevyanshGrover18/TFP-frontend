"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Slide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/banner1.jpg",
    eyebrow: "Cotton Atelier",
    title: "Majestic mountains",
    subtitle: "Find your peace in the heights",
    cta: "Explore Collection",
    href: "#",
  },
  {
    id: 2,
    image: "/banner2.jpg",
    eyebrow: "Seasonal Edit",
    title: "Golden coastlines",
    subtitle: "Where the ocean meets the shore",
    cta: "Shop Now",
    href: "#",
  },
  {
    id: 3,
    image: "/banner3.jpg",
    eyebrow: "Certified Quality",
    title: "Ancient forests",
    subtitle: "Breathe in the wild unknown",
    cta: "Discover More",
    href: "#",
  },
];

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
      }, 700);
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
        className="relative w-full overflow-hidden"
        style={{
          height: "min(92vh, 780px)",
          minHeight: "360px",
          background: "#1a0f08",
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
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,6,2,0.88) 0%, rgba(10,6,2,0.28) 50%, rgba(10,6,2,0.08) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,6,2,0.5) 0%, transparent 65%)" }} />
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
          {/* Layered overlays for warmth */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,6,2,0.9) 0%, rgba(10,6,2,0.32) 45%, rgba(10,6,2,0.08) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,6,2,0.5) 0%, transparent 65%)" }} />
          {/* Subtle warm coral wash at the bottom-left to tie with brand */}
          <div
            className="absolute bottom-0 left-0"
            style={{
              width: "40%",
              height: "35%",
              background: "radial-gradient(ellipse at bottom left, rgba(200,69,26,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── Slide text ── */}
        <div
          className="absolute bottom-0 left-0 right-0 max-w-3xl"
          style={{ padding: "0 clamp(1.25rem, 6vw, 4.5rem) clamp(4rem, 7vw, 6rem)" }}
        >
          {/* Eyebrow */}
          <div
            key={`eyebrow-${current}`}
            className="mb-4 flex items-center gap-2.5"
            style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
          >
            <div
              className="h-1.5 w-1.5 rotate-45 flex-shrink-0"
              style={{ background: "#e8783c" }}
            />
            <p
              className="font-semibold uppercase"
              style={{
                fontSize: "clamp(9px, 1.4vw, 11px)",
                letterSpacing: "0.28em",
                color: "#e8783c",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {slides[current].eyebrow}
            </p>
          </div>

          {/* Title */}
          <h2
            key={`title-${current}`}
            className="mb-4 leading-tight text-white"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(1.8rem, 5.5vw, 3.8rem)",
              fontStyle: "italic",
              fontWeight: 400,
              animation: "fadeUp 0.6s ease 0.2s both",
              color: "#f5ede4",
            }}
          >
            {slides[current].title}
          </h2>

          {/* Subtitle */}
          <p
            key={`sub-${current}`}
            className="mb-8 max-w-lg leading-relaxed"
            style={{
              fontSize: "clamp(13px, 1.8vw, 16px)",
              color: "rgba(245,237,228,0.65)",
              animation: "fadeUp 0.6s ease 0.3s both",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {slides[current].subtitle}
          </p>

          {/* CTA */}
          <a
            key={`cta-${current}`}
            href={slides[current].href}
            className="group inline-flex items-center gap-2.5 uppercase transition-all duration-200"
            style={{
              fontSize: "clamp(9px, 1.4vw, 11px)",
              letterSpacing: "0.22em",
              animation: "fadeUp 0.6s ease 0.4s both",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              color: "#fff",
              paddingBottom: "4px",
              borderBottom: "1px solid rgba(232,120,60,0.7)",
            }}
            onMouseEnter={e => { (e.currentTarget.style.borderBottomColor = "#e8783c"); (e.currentTarget.style.color = "#e8783c"); }}
            onMouseLeave={e => { (e.currentTarget.style.borderBottomColor = "rgba(232,120,60,0.7)"); (e.currentTarget.style.color = "#fff"); }}
          >
            {slides[current].cta}
            <span style={{ color: "#e8783c", fontSize: "14px", lineHeight: 1 }}>→</span>
          </a>
        </div>

        {/* ── Prev button ── */}
        <button
          onClick={() => handleManual(back)}
          aria-label="Previous"
          className="absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
          style={{
            left: "clamp(10px, 2.5vw, 20px)",
            width: "clamp(36px, 5vw, 44px)",
            height: "clamp(36px, 5vw, 44px)",
            background: "rgba(26,15,8,0.55)",
            border: "1px solid rgba(232,120,60,0.25)",
            backdropFilter: "blur(6px)",
            color: "#f5ede4",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #c8451a, #e8783c)";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(26,15,8,0.55)";
            e.currentTarget.style.borderColor = "rgba(232,120,60,0.25)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* ── Next button ── */}
        <button
          onClick={() => handleManual(next)}
          aria-label="Next"
          className="absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
          style={{
            right: "clamp(10px, 2.5vw, 20px)",
            width: "clamp(36px, 5vw, 44px)",
            height: "clamp(36px, 5vw, 44px)",
            background: "rgba(26,15,8,0.55)",
            border: "1px solid rgba(232,120,60,0.25)",
            backdropFilter: "blur(6px)",
            color: "#f5ede4",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #c8451a, #e8783c)";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(26,15,8,0.55)";
            e.currentTarget.style.borderColor = "rgba(232,120,60,0.25)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* ── Dot indicators ── */}
        <div className="absolute bottom-6 right-0 z-50 flex gap-2 pr-[clamp(1.25rem,6vw,4.5rem)]">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleManual(() => goTo(index, index > current ? "right" : "left"))}
              aria-label={`Slide ${index + 1}`}
              className="cursor-pointer rounded-full border-none p-0 transition-all duration-300"
              style={{
                height: "5px",
                width: index === current ? "28px" : "5px",
                background: index === current
                  ? "linear-gradient(90deg, #c8451a, #e8783c)"
                  : "rgba(245,237,228,0.3)",
              }}
            />
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div
          className="absolute top-6 right-0 z-50 flex items-center gap-2"
          style={{
            paddingRight: "clamp(1.25rem, 6vw, 4.5rem)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "rgba(245,237,228,0.45)",
          }}
        >
          <span style={{ color: "#e8783c", fontWeight: 600 }}>
            0{current + 1}
          </span>
          <span style={{ fontSize: "8px" }}>—</span>
          <span>0{slides.length}</span>
        </div>

        {/* ── Keyframes ── */}
        <style>{`
          @keyframes enterRight {
            from { transform: translateX(70px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes enterLeft {
            from { transform: translateX(-70px); opacity: 0; }
            to   { transform: translateX(0);     opacity: 1; }
          }
          @keyframes exitLeft {
            from { transform: translateX(0);     opacity: 1; }
            to   { transform: translateX(-70px); opacity: 0; }
          }
          @keyframes exitRight {
            from { transform: translateX(0);    opacity: 1; }
            to   { transform: translateX(70px); opacity: 0; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default HomeCarousal;
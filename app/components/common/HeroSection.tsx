"use client";
import { getAllImages } from "@/app/services/homeServices";
import { useEffect, useState } from "react";

const FALLBACK_IMAGES = ["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"];

type HeroImage = {
  _id: string;
  url: string;
};

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await getAllImages();
      if (res?.success && res.images?.length > 0) {
        setImages(res.images.map((img: HeroImage) => img.url));
      }
    };
    void fetchImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return; // no point cycling a single image
    const timer = setTimeout(() => {
      if (!transitioning) {
        const next = (currentIndex + 1) % images.length; // ← use images.length
        setPrevIndex(currentIndex);
        setCurrentIndex(next);
        setTransitioning(true);
        setTimeout(() => {
          setPrevIndex(null);
          setTransitioning(false);
        }, 600);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, transitioning, images.length]);

  return (
    <section className="relative w-full h-[480px] sm:h-[520px] lg:h-[650px] overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-bl from-[#ea7939] via-[#fa645e] to-[#f13462]" />

      <div
        className="absolute top-0 right-0 h-full w-full bg-white z-[1] hidden lg:block"
        style={{ clipPath: "polygon(72% 0%, 100% 0%, 100% 100%, 77% 100%)" }}
      />

      <div className="relative z-[2] flex h-full py-6">
        <div className="flex flex-col justify-center p-6 sm:px-12 lg:pl-20 lg:pr-12 w-full lg:w-[65%] text-white">
          <h1
            className="font-serif italic my-4 font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] max-w-[560px]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Sourcing Excellence
            <br />
            Woven Into Every
            <br />
            Detail
          </h1>

          <p className="mt-6 lg:mt-8 text-base sm:text-lg lg:text-2xl leading-[1.6] max-w-[520px] text-white/90">
            Your trusted partner for Innerwear, Swimwear, Activewear &amp;
            Loungewear components and trims.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-5 mt-7 lg:mt-10">
            <a
              href="/products"
              className="px-7 sm:px-9 cursor-pointer py-3 sm:py-4 bg-white text-[#eb4b5e] text-sm sm:text-base font-semibold rounded-full hover:scale-105 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Explore Products →
            </a>
            <button
              className="px-7 sm:px-9 cursor-pointer py-3 sm:py-4 border-2 border-white text-white text-sm sm:text-base font-semibold rounded-full hover:bg-white hover:text-[#eb4b5e] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Contact Us
            </button>
          </div>

          <div
            className="flex flex-wrap gap-4 sm:gap-8 mt-7 lg:mt-10 text-sm sm:text-base text-white/90"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span>✦ Quality Assured</span>
            <span>◇ OEM/ODM</span>
            <span>⊙ On-Time Delivery</span>
          </div>
        </div>

        <div className="relative flex-1 hidden lg:block scale-120">
          <div className="absolute right-[45%] top-[41%] -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] bg-white/10 z-[1]" />
          <div className="absolute right-[47%] top-[49%] -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] bg-white/10 z-[1]" />
          <div className="absolute right-[45%] top-[59%] -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] bg-white/10 z-[1]" />

          <div className="absolute right-2/5 top-1/2 -translate-y-1/2 w-[300px] h-[400px] scale-120 -rotate-45 overflow-hidden rounded-[32px] border-[10px] border-white bg-[#F1ECE6] shadow-sm z-[3]">
            <div className="absolute inset-[-50%] rotate-45 w-[700px] scale-80 right-1">
              <div className="relative w-full h-full overflow-hidden">
                {prevIndex !== null && (
                  <img
                    src={images[prevIndex]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    style={{ animation: "slideOut 0.6s ease forwards" }}
                  />
                )}
                <img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt="Activewear model"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{
                    animation: transitioning ? "slideIn 0.6s ease forwards" : "none",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="absolute top-10 right-10 z-[4] grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-[4px] h-[4px] rounded-full bg-[#e4b9b2]" />
            ))}
          </div>
        </div>

        <div className="absolute top-6 right-6 z-[4] grid grid-cols-4 gap-1.5 lg:hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-white/30" />
          ))}
        </div>
      </div>
    </section>
  );
}
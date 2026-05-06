"use client";

import { useRef, useState } from "react";
import { Shirt, Waves, Dumbbell, Sofa, Moon } from "lucide-react";

type Category = {
  label: string;
  image: string;
  icon: React.ReactNode;
};

const categories: Category[] = [
  {
    label: "Innerwear",
    image: "/innerwear.jpg",
    icon: <Shirt size={32} strokeWidth={1.5} className="text-rose-400" />,
  },
  {
    label: "Swimwear",
    image: "/swimwear.jpg",
    icon: <Waves size={32} strokeWidth={1.5} className="text-rose-400" />,
  },
  {
    label: "Activewear",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80",
    icon: <Dumbbell size={32} strokeWidth={1.5} className="text-rose-400" />,
  },
  {
    label: "Loungewear",
    image: "/lounge.jpg",
    icon: <Sofa size={32} strokeWidth={1.5} className="text-rose-400" />,
  },
  {
    label: "Nightwear",
    image: "/nightwear.jpg",
    icon: <Moon size={32} strokeWidth={1.5} className="text-rose-400" />,
  },
];

function IconCard({ category }: { category: Category }) {
  return (
    <div className="flex-shrink-0 w-[130px] rounded-2xl border border-gray-100 bg-white overflow-hidden cursor-pointer flex flex-col items-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-200">
      <div className="w-full h-[88px] flex items-center justify-center bg-rose-50">
        {category.icon}
      </div>
      <span className="text-[12px] font-normal text-gray-700 py-2.5 px-2 text-center leading-tight">
        {category.label}
      </span>
    </div>
  );
}

function ImageCard({ category }: { category: Category }) {
  const [imgClass, setImgClass] = useState("w-full h-full object-cover");

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > naturalHeight) {
      // landscape — fix height, let width overflow (cropped by container)
      setImgClass("h-full w-auto object-cover");
    } else {
      // portrait or square — fix width, let height overflow (cropped by container)
      setImgClass("w-full h-auto object-cover");
    }
  };

  return (
    <div className="flex-shrink-0 h-[130px] w-[130px] rounded-2xl border border-gray-100 bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-200">
      <img
        src={category.image}
        alt={category.label}
        className={imgClass}
        onLoad={handleLoad}
      />
    </div>
  );
}

export default function IndustriesSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-10 px-4 bg-white flex w-full justify-center">
      <div>
        <div className="flex-1 text-center my-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-800"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Industries we have serv
          </p>
          {/* thin underline centered */}
          <div className="mx-auto mt-2 h-[1px] w-10 bg-gray-300" />
        </div>
        <div
          ref={trackRef}
          className="flex gap-2.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <>
              <IconCard key={`${category.label}-icon`} category={category} />
              <ImageCard key={`${category.label}-image`} category={category} />
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

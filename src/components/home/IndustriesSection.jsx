"use client";

import { Shirt, Waves, Dumbbell, Sofa, Moon } from "lucide-react";







const categories = [
{
  label: "Innerwear",
  image: "/innerwear.jpg",
  icon: <Shirt size={28} strokeWidth={1.5} className="text-rose-400" />
},
{
  label: "Swimwear",
  image: "/swimwear.jpg",
  icon: <Waves size={28} strokeWidth={1.5} className="text-rose-400" />
},
{
  label: "Activewear",
  image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80",
  icon: <Dumbbell size={28} strokeWidth={1.5} className="text-rose-400" />
},
{
  label: "Loungewear",
  image: "/lounge.jpg",
  icon: <Sofa size={28} strokeWidth={1.5} className="text-rose-400" />
},
{
  label: "Nightwear",
  image: "/nightwear.jpg",
  icon: <Moon size={28} strokeWidth={1.5} className="text-rose-400" />
}];


function IconCard({ category }) {
  return (
    <div className="flex flex-col items-center rounded-2xl h-[100px] w-[100px] border border-gray-100 bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-200">
      <div className="w-full flex items-center justify-center bg-rose-50 py-5">
        {category.icon}
      </div>
      <span className="text-[11px] font-medium text-gray-700 py-2.5 px-2 text-center leading-tight">
        {category.label}
      </span>
    </div>);

}

function ImageCard({ category }) {
  return (
    <div className="rounded-2xl border border-gray-100 h-[100px] w-[100px] bg-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-200">
      <img
        src={category.image}
        alt={category.label}
        className="w-full h-full object-cover" />
      
    </div>);

}

export default function IndustriesSection() {
  return (
    <section className="py-10 px-4 sm:px-8 lg:px-16 bg-white">
      <div className=" max-w-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-800"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            
            Industries we serve
          </p>
          <div className="mx-auto mt-2 h-[1px] w-10 bg-gray-300" />
        </div>

        {/*
           Grid: alternating icon + image pairs per category.
           On mobile: 2 cols (icon | image) × 5 rows
           On sm+: all 10 cards in a single responsive row via auto-fit
          */}
        <div className="grid grid-cols-[repeat(2,1fr)] gap-3 sm:grid-cols-[repeat(10,1fr)]">
          {categories.map((category) =>
          <>
              <IconCard key={`${category.label}-icon`} category={category} />
              <ImageCard key={`${category.label}-image`} category={category} />
            </>
          )}
        </div>
      </div>
    </section>);

}
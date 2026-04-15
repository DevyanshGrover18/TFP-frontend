"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { getAllCategories } from "@/app/services/categoriesService";

type CategoryNode = {
  _id: string;
  name: string;
  image: string;
  parentId: string | null;
  level: number;
  children?: CategoryNode[];
};

const MegaMenu = ({
  category,
  onClose,
}: {
  category: CategoryNode;
  onClose: () => void;
}) => {
  const hasChildren = (category.children?.length ?? 0) > 0;

  return (
    <div className="absolute left-0 right-0 top-full z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="max-w-5xl mx-auto px-10 py-6">
        {hasChildren ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {category.children!.map((child) => (
              <div key={child._id}>
                <p className="text-md font-semibold text-red-600 mb-2">
                  {child.name}
                </p>
                {(child.children?.length ?? 0) > 0 && (
                  <ul className="grid grid-flow-col grid-rows-3 gap-x-6 gap-y-1">
                    {child.children!.map((sub) => (
                      <li key={sub._id}>
                        <a
                          href="#"
                          onClick={onClose}
                          className="text-sm text-gray-500 hover:text-red-600 transition"
                        >
                          {sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No subcategories available.</p>
        )}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryNode | null>(
    null,
  );
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCategories = async () => {
    const response = await getAllCategories();
    const data = (response?.categories ?? []) as CategoryNode[];
    setCategories(data);
  };

  const handleCategoryClick = (category: CategoryNode) => {
    const hasChildren = (category.children?.length ?? 0) > 0;
    if (!hasChildren) {
      setActiveCategory(null);
      return;
    }
    setActiveCategory((prev) => (prev?._id === category._id ? null : category));
  };

  return (
    <nav
      ref={navRef}
      className="bg-white border-b border-gray-100 w-full relative"
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-6 md:px-10 py-3 gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <span className="text-3xl font-bold text-red-600 tracking-tight font-serif leading-none">
            tfp
          </span>
          <p className="text-[9px] text-red-500 tracking-widest uppercase leading-none mt-0.5">
            the fabric people
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-1 max-w-xl items-center border border-gray-200 rounded-sm overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none placeholder-gray-400 bg-white"
          />
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition border-l border-gray-200">
            <Search size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button className="text-gray-600 hover:text-gray-900 transition">
            <User size={22} strokeWidth={1.5} />
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition">
            <ShoppingBag size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Bottom row — category links */}
      <div className="flex items-center justify-center gap-8 px-6 md:px-10 pb-3">
        {categories.map((category) => {
          const hasChildren = (category.children?.length ?? 0) > 0;
          const isActive = activeCategory?._id === category._id;

          return (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className={`text-md font-medium uppercase cursor-pointer flex items-center gap-1 transition whitespace-nowrap ${
                isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              {category.name}
              {hasChildren && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isActive ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
          );
        })}
        <button
          className={`text-md text-gray-700 hover:text-red-600 font-medium uppercase cursor-pointer flex items-center gap-1 transition whitespace-nowrap"`}
        >Special</button>
      </div>

      {activeCategory && (
        <MegaMenu
          category={activeCategory}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </nav>
  );
};

export default Navbar;

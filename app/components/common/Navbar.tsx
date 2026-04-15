"use client";

import Link from "next/link";
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
    <div className="absolute left-0 right-0 top-full z-50 bg-neutral border-t border-tertiary shadow-sm">
      <div className="max-w-5xl mx-auto px-10 py-8">
        {hasChildren ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {category.children!.map((child) => (
              <div key={child._id}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary mb-3">
                  {child.name}
                </p>
                {(child.children?.length ?? 0) > 0 && (
                  <ul className="space-y-2">
                    {child.children!.map((sub) => (
                      <li key={sub._id}>
                        <a
                          href="#"
                          onClick={onClose}
                          className="text-sm text-primary hover:text-secondary transition-colors duration-150"
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
          <p className="text-sm text-secondary">No subcategories available.</p>
        )}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryNode | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

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
      className="w-full relative bg-neutral border-b border-tertiary"
    >
      <div className="flex items-center justify-between px-8 md:px-14 py-4 gap-6">

        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary font-serif">
            The Fabric People
          </Link>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {categories.map((category) => {
            const hasChildren = (category.children?.length ?? 0) > 0;
            const isActive = activeCategory?._id === category._id;

            return (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center gap-1 text-md font-sans italic font-medium transition-colors duration-150 pb-0.5 border-b-[1.5px] ${
                  isActive
                    ? "text-secondary border-secondary"
                    : "text-primary border-transparent hover:text-secondary"
                }`}
              >
                {category.name}
                {hasChildren && (
                  <ChevronDown
                    size={14}
                    className={`text-tertiary transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                  />
                )}
              </button>
            );
          })}

          <button className="text-md italic font-medium text-primary font-sans hover:text-secondary transition-colors duration-150 border-b-[1.5px] border-transparent pb-0.5">
            Special
          </button>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5">

          {/* Expandable search */}
          <div className="flex items-center gap-2">
            {searchOpen && (
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fabrics..."
                className="text-sm outline-none bg-transparent border-b border-secondary w-40 pb-0.5 text-primary placeholder-tertiary font-sans"
              />
            )}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-secondary transition-colors duration-150 font-sans"
            >
              <Search size={15} strokeWidth={1.5} />
              {!searchOpen && <span>Search</span>}
            </button>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-secondary transition-colors duration-150 font-sans"
          >
            <User size={15} strokeWidth={1.5} />
            <span>Account</span>
          </Link>

          <button className="text-primary hover:text-secondary transition-colors duration-150">
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>

        </div>
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

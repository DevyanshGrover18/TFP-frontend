"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Search, User, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import { getAllCategories } from "@/app/services/categoriesService";
import { useRouter } from "next/navigation";

type CategoryNode = {
  _id: string;
  name: string;
  image: string;
  parentId: string | null;
  level: number;
  children?: CategoryNode[];
};

// ─── Mega Menu (desktop) ──────────────────────────────────────────────────────

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
                          href={`/products?subsubcategory=${sub.name}`}
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

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

const MobileDrawer = ({
  categories,
  isOpen,
  onClose,
}: {
  categories: CategoryNode[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));
  const toggleSub = (id: string) =>
    setExpandedSubId((prev) => (prev === id ? null : id));

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-neutral flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ddd6cc]">
          <Link
            href="/"
            onClick={onClose}
            className="text-lg font-bold tracking-tight text-primary font-serif italic"
          >
            The Fabric People
          </Link>
          <button
            onClick={onClose}
            className="text-[#9a9088] hover:text-[#171512] transition-colors"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer nav */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {categories.map((category) => {
            const hasChildren = (category.children?.length ?? 0) > 0;
            const isExpanded = expandedId === category._id;

            return (
              <div key={category._id} className="border-b border-[#f0ebe4]">
                <button
                  onClick={() => hasChildren && toggle(category._id)}
                  className="flex items-center justify-between w-full px-2 py-3.5 text-left"
                >
                  <span className="text-sm italic font-medium text-[#171512]">
                    {category.name}
                  </span>
                  {hasChildren && (
                    <ChevronDown
                      size={14}
                      className={`text-[#9a9088] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Sub-categories */}
                {hasChildren && isExpanded && (
                  <div className="pb-2 pl-3">
                    {category.children!.map((child) => {
                      const hasGrandChildren = (child.children?.length ?? 0) > 0;
                      const isSubExpanded = expandedSubId === child._id;

                      return (
                        <div key={child._id}>
                          <button
                            onClick={() => hasGrandChildren && toggleSub(child._id)}
                            className="flex items-center justify-between w-full px-2 py-2 text-left"
                          >
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a736c]">
                              {child.name}
                            </span>
                            {hasGrandChildren && (
                              <ChevronDown
                                size={12}
                                className={`text-[#b8b0a6] transition-transform duration-200 ${isSubExpanded ? "rotate-180" : ""}`}
                              />
                            )}
                          </button>

                          {/* Sub-sub-categories */}
                          {hasGrandChildren && isSubExpanded && (
                            <ul className="pb-2 pl-3 space-y-1">
                              {child.children!.map((sub) => (
                                <li key={sub._id}>
                                  <a
                                    href={`/products?subsubcategory=${sub.name}`}
                                    onClick={onClose}
                                    className="block px-2 py-1.5 text-sm text-[#4a443d] hover:text-[#171512] transition-colors"
                                  >
                                    {sub.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Special link */}
          <div className="border-b border-[#f0ebe4]">
            <button className="flex w-full px-2 py-3.5 text-left text-sm italic font-medium text-[#171512]">
              Special
            </button>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="border-t border-[#ddd6cc] px-6 py-5 flex items-center gap-5">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#171512] hover:text-[#9a9088] transition-colors font-sans"
          >
            <User size={15} strokeWidth={1.5} />
            <span>Account</span>
          </Link>
        </div>
      </div>
    </>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryNode | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    getCategories();
  }, []);

  const handleNavigate = (slug: string) => {
    router.replace(`/${slug}`);
  };

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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
    <>
      <nav
        ref={navRef}
        className="w-full relative bg-neutral border-b border-tertiary"
      >
        <div className="flex items-center justify-between px-5 sm:px-8 md:px-14 py-4 gap-4">

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden text-primary hover:text-secondary transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold tracking-tight text-primary font-serif italic"
            >
              The Fabric People
            </Link>
          </div>

          {/* Desktop nav links */}
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
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Expandable search */}
            <div className="flex items-center gap-2">
              {searchOpen && (
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search fabrics..."
                  className="text-sm outline-none bg-transparent border-b border-secondary w-28 sm:w-40 pb-0.5 text-primary placeholder-tertiary font-sans"
                />
              )}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-secondary transition-colors duration-150 font-sans"
              >
                <Search size={15} strokeWidth={1.5} />
                {!searchOpen && <span className="hidden sm:inline">Search</span>}
              </button>
            </div>

            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-secondary transition-colors duration-150 font-sans"
            >
              <User size={15} strokeWidth={1.5} />
              <span className="hidden md:inline">Account</span>
            </Link>

            <button
              onClick={() => handleNavigate("cart")}
              className="text-primary cursor-pointer hover:text-secondary transition-colors duration-150"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>

          </div>
        </div>

        {/* Desktop mega menu */}
        {activeCategory && (
          <MegaMenu
            category={activeCategory}
            onClose={() => setActiveCategory(null)}
          />
        )}
      </nav>

      {/* Mobile drawer — rendered outside nav so it can cover full screen */}
      <MobileDrawer
        categories={categories}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
};

export default Navbar;
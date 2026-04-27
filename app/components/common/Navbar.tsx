"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/app/services/categoriesService";
import { useAuth } from "@/app/context/AuthContext";
import { useCartCount } from "@/app/context/CartCountContext";
import { getCartItems } from "@/app/services/cartService";
import { getStoredUser } from "@/app/services/userSession";
import SpecialUserLoginModal from "@/app/components/specialUsers/SpecialUserLoginModal";

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
    <div className="absolute left-0 right-0 top-full z-50 border-t border-tertiary bg-neutral shadow-sm">
      <div className="mx-auto max-w-5xl px-10 py-8">
        {hasChildren ? (
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
            {category.children!.map((child) => (
              <div key={child._id}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                  {child.name}
                </p>
                {(child.children?.length ?? 0) > 0 && (
                  <ul className="space-y-2">
                    {child.children!.map((sub) => (
                      <li key={sub._id}>
                        <a
                          href={`/products?category=${category._id}&subcategory=${child._id}&subsubcategory=${sub._id}`}
                          onClick={onClose}
                          className="text-sm text-primary transition-colors duration-150 hover:text-secondary"
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

const MobileDrawer = ({
  categories,
  isOpen,
  onClose,
  onSpecialClick,
}: {
  categories: CategoryNode[];
  isOpen: boolean;
  onClose: () => void;
  onSpecialClick: () => void;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));
  const toggleSub = (id: string) =>
    setExpandedSubId((prev) => (prev === id ? null : id));

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-[300px] flex-col bg-neutral transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#ddd6cc] px-6 py-5">
          <Link
            href="/"
            onClick={onClose}
            className="font-serif text-lg font-bold italic tracking-tight text-primary"
          >
            The Fabric People
          </Link>
          <button
            onClick={onClose}
            className="text-[#9a9088] transition-colors hover:text-[#171512]"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {categories.map((category) => {
            const hasChildren = (category.children?.length ?? 0) > 0;
            const isExpanded = expandedId === category._id;

            return (
              <div key={category._id} className="border-b border-[#f0ebe4]">
                <button
                  onClick={() => hasChildren && toggle(category._id)}
                  className="flex w-full items-center justify-between px-2 py-3.5 text-left"
                >
                  <span className="text-sm font-medium italic text-[#171512]">
                    {category.name}
                  </span>
                  {hasChildren && (
                    <ChevronDown
                      size={14}
                      className={`text-[#9a9088] transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="pb-2 pl-3">
                    {category.children!.map((child) => {
                      const hasGrandChildren =
                        (child.children?.length ?? 0) > 0;
                      const isSubExpanded = expandedSubId === child._id;

                      return (
                        <div key={child._id}>
                          <button
                            onClick={() =>
                              hasGrandChildren && toggleSub(child._id)
                            }
                            className="flex w-full items-center justify-between px-2 py-2 text-left"
                          >
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a736c]">
                              {child.name}
                            </span>
                            {hasGrandChildren && (
                              <ChevronDown
                                size={12}
                                className={`text-[#b8b0a6] transition-transform duration-200 ${
                                  isSubExpanded ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </button>

                          {hasGrandChildren && isSubExpanded && (
                            <ul className="space-y-1 pb-2 pl-3">
                              {child.children!.map((sub) => (
                                <li key={sub._id}>
                                  <a
                                    href={`/products?subsubcategory=${sub.name}`}
                                    onClick={onClose}
                                    className="block px-2 py-1.5 text-sm text-[#4a443d] transition-colors hover:text-[#171512]"
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

          <div className="border-b border-[#f0ebe4]">
            <button
              type="button"
              onClick={onSpecialClick}
              className="flex w-full px-2 py-3.5 text-left text-sm font-medium italic text-[#171512]"
            >
              Special
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 border-t border-[#ddd6cc] px-6 py-5">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-[#171512] transition-colors hover:text-[#9a9088]"
          >
            <User size={15} strokeWidth={1.5} />
            <span>Account</span>
          </Link>
        </div>
      </div>
    </>
  );
};

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryNode[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryNode | null>(
    null,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSpecialLoginOpen, setIsSpecialLoginOpen] = useState(false);
  const [isSpecialLoginLoading, setIsSpecialLoginLoading] = useState(false);
  const [specialLoginError, setSpecialLoginError] = useState("");

  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { isSpecialSession, loginAsSpecialUser } = useAuth();
  const { count, setCount } = useCartCount();

  useEffect(() => {
    void (async () => {
      const response = await getAllCategories();
      setAllCategories((response?.categories ?? []) as CategoryNode[]);
    })();
  }, []);

  useEffect(() => {
    const user = getStoredUser();
    if (!user?.id) return;

    const loadCount = async () => {
      try {
        const response = await getCartItems();
        setCount(response.items?.length ?? 0);
      } catch {
        return;
      }
    };

    void loadCount();
  }, [setCount]);

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
    if (searchOpen) {
      searchRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (
      activeCategory &&
      !allCategories.find((category) => category._id === activeCategory._id)
    ) {
      setActiveCategory(null);
    }
  }, [activeCategory, allCategories]);

  const handleCategoryClick = (category: CategoryNode) => {
    const hasChildren = (category.children?.length ?? 0) > 0;
    if (!hasChildren) {
      setActiveCategory(null);
      return;
    }

    setActiveCategory((prev) =>
      prev?._id === category._id ? null : category,
    );
  };

  const openSpecialAccess = () => {
    setActiveCategory(null);
    setMobileOpen(false);

    if (isSpecialSession) {
      router.push("/special");
      return;
    }

    setSpecialLoginError("");
    setIsSpecialLoginOpen(true);
  };

  const handleSpecialLogin = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      setIsSpecialLoginLoading(true);
      setSpecialLoginError("");
      await loginAsSpecialUser(values.email, values.password);
      setIsSpecialLoginOpen(false);
      router.push("/special");
      router.refresh();
    } catch (error) {
      setSpecialLoginError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setIsSpecialLoginLoading(false);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="relative w-full border-b border-tertiary bg-neutral"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 md:px-14">
          <button
            className="text-primary transition-colors hover:text-secondary md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <div className="shrink-0">
            <Link
              href="/"
              className="font-serif text-lg font-bold italic tracking-tight text-primary sm:text-xl"
            >
              The Fabric People
            </Link>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            {allCategories.map((category) => {
              const hasChildren = (category.children?.length ?? 0) > 0;
              const isActive = activeCategory?._id === category._id;

              return (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center gap-1 border-b-[1.5px] pb-0.5 font-sans text-md font-medium italic transition-colors duration-150 ${
                    isActive
                      ? "border-secondary text-secondary"
                      : "border-transparent text-primary hover:text-secondary"
                  }`}
                >
                  {category.name}
                  {hasChildren && (
                    <ChevronDown
                      size={14}
                      className={`text-tertiary transition-transform duration-200 ${
                        isActive ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={openSpecialAccess}
              className={`border-b-[1.5px] pb-0.5 font-sans text-md font-medium italic ${
                isSpecialSession
                  ? "border-secondary text-secondary"
                  : "border-transparent text-primary"
              }`}
            >
              Special
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              {searchOpen && (
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search fabrics..."
                  className="w-28 border-b border-secondary bg-transparent pb-0.5 font-sans text-sm text-primary outline-none placeholder-tertiary sm:w-40"
                />
              )}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-primary transition-colors duration-150 hover:text-secondary"
              >
                <Search size={15} strokeWidth={1.5} />
                {!searchOpen && <span className="hidden sm:inline">Search</span>}
              </button>
            </div>

            <Link
              href="/account"
              className="hidden items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-primary transition-colors duration-150 hover:text-secondary sm:flex"
            >
              <User size={15} strokeWidth={1.5} />
              <span className="hidden md:inline">Account</span>
            </Link>

            <button
              onClick={() => router.replace("/cart")}
              className="relative cursor-pointer text-primary transition-colors duration-150 hover:text-secondary"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
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

      <MobileDrawer
        categories={allCategories}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSpecialClick={openSpecialAccess}
      />

      <SpecialUserLoginModal
        isOpen={isSpecialLoginOpen}
        isLoading={isSpecialLoginLoading}
        externalError={specialLoginError}
        onClose={() => {
          setIsSpecialLoginOpen(false);
          setSpecialLoginError("");
        }}
        onSubmit={handleSpecialLogin}
      />
    </>
  );
};

export default Navbar;

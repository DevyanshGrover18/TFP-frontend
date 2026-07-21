"use client";

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Search, User, ShoppingBag, ChevronDown, Menu, X, Sparkles } from "lucide-react";
import { useRouter } from "@/hooks/useRouter";
import { getAllCategories } from "@/services/categoriesService";
import { useAuth } from "@/context/AuthContext";
import { useCartCount } from "@/context/CartCountContext";
import { getCartItems } from "@/services/cartService";
import SearchBar from "./SearchBar";










// ─── Mega Menu ────────────────────────────────────────────────────────────────

const MegaMenu = ({
  category,
  onClose



}) => {
  const hasChildren = (category.children?.length ?? 0) > 0;
  const router = useRouter();

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 animate-in slide-in-from-top-2 duration-200"
      style={{
        background: "linear-gradient(160deg, #ffffff 0%, #fdf8f4 60%, #fef4ee 100%)",
        borderTop: "1px solid rgba(200, 69, 26, 0.12)",
        boxShadow: "0 8px 32px rgba(200, 69, 26, 0.06), 0 2px 8px rgba(0,0,0,0.04)"
      }}>
      
      <div
        className="h-[2px] w-full"
        style={{ background: "linear-gradient(90deg, transparent, #c8451a, #e8783c, #f0a060, #e8783c, #c8451a, transparent)" }} />
      

      <div className="mx-auto max-w-6xl px-12 py-10">
        {hasChildren ?
        <div className="flex gap-12">
            <div className="flex flex-col justify-between py-1 shrink-0">
              <div>
                <p className="font-serif italic text-3xl font-semibold leading-tight" style={{ color: "#1a0f08" }}>
                  {category.name}
                </p>
                <div className="mt-2 h-[2px] w-10 rounded-full" style={{ background: "linear-gradient(90deg, #c8451a, #e8783c)" }} />
              </div>
              <button
              onClick={() => router.push(`/products?category=${category._id}`)}
              className="text-[10px] uppercase cursor-pointer tracking-[0.25em] mt-6"
              style={{ color: "#c8451a" }}>
              
                Browse All →
              </button>
            </div>

            <div className="w-px self-stretch" style={{ background: "linear-gradient(to bottom, transparent, rgba(200,69,26,0.2), transparent)" }} />

            <div className="flex-1 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
              {category.children.map((child) =>
            <div key={child._id}>
                  <button
                onClick={() => router.push(`/products?category=${category._id}&subcategory=${child._id}`)}
                className="mb-3 text-[10px] font-semibold cursor-pointer uppercase tracking-[0.22em]"
                style={{ color: "#c8451a" }}>
                
                    {child.name}
                  </button>

                  {(child.children?.length ?? 0) > 0 &&
              <ul className="space-y-2">
                      {child.children.map((sub) =>
                <li key={sub._id}>
                          <a
                    href={`/products?category=${category._id}&subcategory=${child._id}&subsubcategory=${sub._id}`}
                    onClick={onClose}
                    className="group flex items-center gap-1.5 text-sm transition-all duration-150"
                    style={{ color: "#7a6a60" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#c8451a"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#7a6a60"}>
                    
                            <span className="inline-block h-1 w-1 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "#e8783c" }} />
                            {sub.name}
                          </a>
                        </li>
                )}
                    </ul>
              }
                </div>
            )}
            </div>
          </div> :

        <p className="text-sm" style={{ color: "#9a8a7e" }}>No subcategories available.</p>
        }

        <div className="mt-8 flex items-center gap-2">
          {Array.from({ length: 12 }).map((_, i) =>
          <div key={i} className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background: i % 3 === 0 ? "rgba(200,69,26,0.25)" : "rgba(200,69,26,0.08)" }} />
          )}
        </div>
      </div>
    </div>);

};

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

const MobileDrawer = ({
  categories,
  isOpen,
  onClose,
  onSpecialClick





}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedSubId, setExpandedSubId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => prev === id ? null : id);
  const toggleSub = (id) => setExpandedSubId((prev) => prev === id ? null : id);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`
        }
        style={{ background: "rgba(26, 15, 8, 0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose} />
      

      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-[300px] flex-col transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"}`
        }
        style={{ background: "linear-gradient(160deg, #ffffff 0%, #fdf8f4 100%)", borderRight: "1px solid rgba(200, 69, 26, 0.12)" }}>
        
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(200, 69, 26, 0.12)" }}>
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <TfpLogoMark size={28} />
            <span className="font-serif italic text-base font-semibold" style={{ color: "#1a0f08" }}>
              The Fabric People
            </span>
          </Link>
          <button onClick={onClose} style={{ color: "#b0a098" }} className="transition-colors hover:text-[#c8451a]" aria-label="Close menu">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {categories.map((category) => {
            const hasChildren = (category.children?.length ?? 0) > 0;
            const isExpanded = expandedId === category._id;

            return (
              <div key={category._id} style={{ borderBottom: "1px solid rgba(200, 69, 26, 0.08)" }}>
                <button
                  onClick={() => hasChildren && toggle(category._id)}
                  className="flex w-full items-center justify-between px-6 py-3.5 text-left transition-colors"
                  style={{ color: isExpanded ? "#c8451a" : "#3a2a20" }}>
                  
                  <span className="text-sm font-medium uppercase tracking-[0.08em]">{category.name}</span>
                  {hasChildren &&
                  <ChevronDown size={13} strokeWidth={2} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} style={{ color: "#6b5b4e" }} />
                  }
                </button>

                {hasChildren && isExpanded &&
                <div className="pb-3 pl-6" style={{ background: "rgba(200, 69, 26, 0.03)" }}>
                    {category.children.map((child) => {
                    const hasGrandChildren = (child.children?.length ?? 0) > 0;
                    const isSubExpanded = expandedSubId === child._id;

                    return (
                      <div key={child._id}>
                          <button
                          onClick={() => hasGrandChildren && toggleSub(child._id)}
                          className="flex w-full items-center justify-between px-4 py-2 text-left">
                          
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#e8783c" }}>
                              {child.name}
                            </span>
                            {hasGrandChildren &&
                          <ChevronDown size={11} className={`transition-transform duration-200 ${isSubExpanded ? "rotate-180" : ""}`} style={{ color: "#6b5b4e" }} />
                          }
                          </button>

                          {hasGrandChildren && isSubExpanded &&
                        <ul className="space-y-0.5 pb-2 pl-4">
                              {child.children.map((sub) =>
                          <li key={sub._id}>
                                  <a
                              href={`/products?subsubcategory=${sub.name}`}
                              onClick={onClose}
                              className="block px-3 py-1.5 text-sm transition-colors"
                              style={{ color: "#7a6a60" }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "#f5ede4"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "#7a6a60"}>
                              
                                    {sub.name}
                                  </a>
                                </li>
                          )}
                            </ul>
                        }
                        </div>);

                  })}
                  </div>
                }
              </div>);

          })}

          <div style={{ borderBottom: "1px solid rgba(200, 69, 26, 0.08)" }}>
            <button
              type="button"
              onClick={onSpecialClick}
              className="flex w-full items-center gap-2 px-6 py-3.5 text-left"
              style={{ color: "#e8783c" }}>
              
              <Sparkles size={13} strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-[0.08em]">Special</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 px-6 py-5" style={{ borderTop: "1px solid rgba(200, 69, 26, 0.12)" }}>
          <Link to="/account"
            onClick={onClose}
            className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
            style={{ color: "#8a7a70" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1a0f08"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#8a7a70"}>
            
            <User size={14} strokeWidth={1.5} />
            <span>Account</span>
          </Link>
        </div>
      </div>
    </>);

};

// ─── Logo mark SVG ────────────────────────────────────────────────────────────

const TfpLogoMark = ({ size = 32 }) =>
<svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="2" y="14" width="16" height="2.5" rx="1.25" fill="#e8783c" />
    <rect x="2" y="19" width="12" height="2.5" rx="1.25" fill="#e8783c" opacity="0.7" />
    <rect x="2" y="24" width="8" height="2.5" rx="1.25" fill="#e8783c" opacity="0.4" />
    <text x="20" y="28" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="600" fontSize="18" fill="#1a0f08">f</text>
  </svg>;


// ─── Main Navbar ──────────────────────────────────────────────────────────────

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef(null);
  const router = useRouter();

  const { sessionType, isSpecialSession } = useAuth();
  const { count, setCount } = useCartCount();

  useEffect(() => {
    void (async () => {
      const response = await getAllCategories();
      setAllCategories(response?.categories ?? []);
    })();
  }, []);

  useEffect(() => {
    if (sessionType === null || sessionType !== "user" && sessionType !== "special") return;
    const loadCount = async () => {
      try {
        const response = await getCartItems();
        setCount(response.items?.length ?? 0);
      } catch {
        return;
      }
    };
    void loadCount();
  }, [setCount, sessionType]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveCategory(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {document.body.style.overflow = "";};
  }, [mobileOpen]);

  const handleCategoryClick = (category) => {
    const hasChildren = (category.children?.length ?? 0) > 0;
    if (!hasChildren) {setActiveCategory(null);return;}
    setActiveCategory((prev) => prev?._id === category._id ? null : category);
  };

  const openSpecialAccess = () => {
    setActiveCategory(null);
    setMobileOpen(false);
    // If already in a special session go straight to the catalog,
    // otherwise send them to the login page.
    router.push(isSpecialSession ? "/special" : "/special/login");
  };

  return (
    <>
      <nav
        ref={navRef}
        className="relative w-full"
        style={{ background: "#12090400", backgroundColor: "#12090400" }}>
        
        <div
          className="flex items-center justify-between gap-4 px-6 py-0 sm:px-10 md:px-14"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fdf8f4 60%, #fef5ee 100%)",
            borderBottom: "1px solid rgba(200, 69, 26, 0.12)",
            height: "68px"
          }}>
          
          {/* Mobile hamburger */}
          <button
            className="transition-colors md:hidden"
            style={{ color: "#b0a098" }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            onMouseEnter={(e) => e.currentTarget.style.color = "#c8451a"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#b0a098"}>
            
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo-black.png" alt="The Fabric People" className="h-20" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {allCategories.map((category) => {
              const hasChildren = (category.children?.length ?? 0) > 0;
              const isActive = activeCategory?._id === category._id;
              return (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[11.5px] font-medium uppercase tracking-[0.1em] rounded transition-all duration-150 relative"
                  style={{
                    color: isActive ? "#c8451a" : "#6b5b50",
                    background: isActive ? "rgba(200, 69, 26, 0.06)" : "transparent",
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#1a0f08";
                      e.currentTarget.style.background = "rgba(200, 69, 26, 0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#6b5b50";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}>
                  
                  {isActive &&
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ background: "linear-gradient(90deg, #c8451a, #e8783c)" }} />
                  }
                  {category.name}
                  {hasChildren &&
                  <ChevronDown size={11} strokeWidth={2.5} className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} style={{ color: isActive ? "#c8451a" : "#b0a098", flexShrink: 0 }} />
                  }
                </button>);

            })}

            {/* Special */}
            <button
              type="button"
              onClick={openSpecialAccess}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 rounded text-[11.5px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 ml-1"
              style={{
                background: isSpecialSession ? "linear-gradient(135deg, #c8451a, #e8783c)" : "rgba(200, 69, 26, 0.12)",
                color: isSpecialSession ? "#fff" : "#e8783c",
                border: "1px solid rgba(200, 69, 26, 0.3)",
                fontFamily: "'DM Sans', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #c8451a, #e8783c)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                if (!isSpecialSession) {
                  e.currentTarget.style.background = "rgba(200, 69, 26, 0.12)";
                  e.currentTarget.style.color = "#e8783c";
                }
              }}>
              
              <Sparkles size={11} strokeWidth={2} />
              Special
            </button>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            {searchOpen ?
            <SearchBar onClose={() => setSearchOpen(false)} isSpecialSession={isSpecialSession} /> :

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-150"
              style={{ color: "#8a7a70", fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#c8451a"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#8a7a70"}>
              
                <Search size={14} strokeWidth={1.5} />
                <span className="hidden sm:inline">Search</span>
              </button>
            }

            <Link to="/account"
              className="hidden items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-150 sm:flex"
              style={{ color: "#8a7a70", fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#1a0f08"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#8a7a70"}>
              
              <User size={14} strokeWidth={1.5} />
              <span className="hidden md:inline">Account</span>
            </Link>

            <button
              onClick={() => router.replace("/cart")}
              className="relative cursor-pointer transition-colors duration-150"
              style={{ color: "#8a7a70" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#c8451a"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#8a7a70"}>
              
              <ShoppingBag size={17} strokeWidth={1.5} />
              {count > 0 &&
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "#c8451a" }}>
                  {count}
                </span>
              }
            </button>
          </div>
        </div>

        {activeCategory &&
        <MegaMenu category={activeCategory} onClose={() => setActiveCategory(null)} />
        }
      </nav>

      <MobileDrawer
        categories={allCategories}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSpecialClick={openSpecialAccess} />
      
    </>);

};

export default Navbar;
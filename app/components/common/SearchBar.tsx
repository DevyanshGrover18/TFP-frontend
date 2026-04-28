"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import {
  getAllProducts,
  getProductHref,
  getProductPrimaryImage,
  type ProductRecord,
} from "@/app/services/productsService";
import { isProductVisibleForSession } from "@/app/services/catalogAccess";

export default function SearchBar({
  onClose,
  isSpecialSession,
}: {
  onClose: () => void;
  isSpecialSession: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductRecord[]>([]);
  const [allProducts, setAllProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts();
        const all = res?.products ?? [];
        setAllProducts(
          all.filter((p) => isProductVisibleForSession(p, isSpecialSession)),
        );
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [isSpecialSession]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const fuse = new Fuse(allProducts, {
      keys: [
        { name: "name", weight: 2 },
        { name: "tags", weight: 1.5 },
        { name: "specifications.value", weight: 1 },
        { name: "colorCode", weight: 1 },
      ],
      threshold: 0.4,
      minMatchCharLength: 2,
      useExtendedSearch: false,
      getFn: (obj, path) => {
        if (path[0] === "tags") {
          return Array.isArray(obj.tags) ? obj.tags : [];
        }
        return Fuse.config.getFn(obj, path);
      },
    });

    const results = fuse
      .search(trimmed)
      .map((r) => r.item)
      .slice(0, 8);
    setResults(results);
    setActiveIndex(-1);
  }, [query, allProducts]);

  const navigate = useCallback(
    (product: ProductRecord) => {
      router.push(getProductHref(product));
      onClose();
    },
    [router, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      navigate(results[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const showDropdown = query.trim().length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 border-b border-secondary pb-0.5">
        <Search size={14} strokeWidth={1.5} className="text-secondary" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search fabrics..."
          className="w-48 bg-transparent font-sans text-sm text-primary outline-none placeholder-tertiary sm:w-64"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-tertiary hover:text-primary"
          >
            <X size={13} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-md border border-tertiary bg-neutral shadow-md sm:w-96">
          {loading ? (
            <p className="px-4 py-3 text-sm text-secondary">Loading...</p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((product, i) => {
                const image = getProductPrimaryImage(product);
                return (
                  <li key={product._id}>
                    <button
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => navigate(product)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        activeIndex === i
                          ? "bg-secondary/10"
                          : "hover:bg-secondary/5"
                      }`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-10 w-10 flex-shrink-0 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-tertiary" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-primary">
                          {product.name}
                        </p>
                        {product.subSubCategoryId?.name && (
                          <p className="truncate text-xs text-secondary">
                            {product.subSubCategoryId.name}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-secondary">
              No products found for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}

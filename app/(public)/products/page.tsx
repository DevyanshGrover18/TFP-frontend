"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "../../components/common/ProductCard";
import {
  getAllProducts,
  getProductDisplayColor,
  getProductFilters,
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification,
  type ProductFilterGroup,
  type ProductFilterOption,
  type ProductRecord,
} from "../../services/productsService";
import { useAuth } from "@/app/context/AuthContext";
import {
  isProductAllowedForCategoryIds,
  isProductVisibleForSession,
  sortSpecialProductsFirst,
} from "@/app/services/catalogAccess";
import { Check, SlidersHorizontal, X } from "lucide-react";

type SidebarFilterGroup = {
  key: string;
  label: string;
  values: ProductFilterOption[];
};

type FiltersState = {
  categories: ProductFilterOption[];
  subCategories: ProductFilterOption[];
  subSubCategories: ProductFilterOption[];
  specifications: ProductFilterGroup[];
};

type ProductRef = string | { _id?: string; id?: string; name?: string };

const EMPTY_FILTERS: FiltersState = {
  categories: [],
  subCategories: [],
  subSubCategories: [],
  specifications: [],
};

const CATEGORY_PARAM = "category";
const SUB_CATEGORY_PARAM = "subcategory";
const SUB_SUB_CATEGORY_PARAM = "subsubcategory";

const formatFilterLabel = (value: string) =>
  value.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const getSelectedValues = (searchParams: URLSearchParams, key: string) =>
  Array.from(new Set(searchParams.getAll(key).filter(Boolean)));

const getProductRefId = (value: ProductRef | undefined) =>
  typeof value === "string" ? value : (value?._id ?? value?.id);

const matchesMultiValueFilter = (
  selectedValues: string[],
  candidate: string | undefined,
) => {
  if (!selectedValues.length) return true;
  return candidate ? selectedValues.includes(candidate) : false;
};

function SidebarFilterSection({
  title,
  paramKey,
  activeValues,
  options,
  onToggle,
}: {
  title: string;
  paramKey: string;
  activeValues: string[];
  options: ProductFilterOption[];
  onToggle: (paramKey: string, value: string) => void;
}) {
  if (!options.length) return null;

  return (
    <div className="mt-6 border-t pt-5" style={{ borderColor: "#f0e0dc" }}>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: "#d94f4f", fontFamily: "'DM Sans', sans-serif" }}
      >
        {title}
      </p>
      <div className="mt-3 flex flex-col gap-1">
        {options.map((option) => {
          const optionValue = option.id ?? option.value ?? option.label;
          const isActive = activeValues.includes(optionValue);
          return (
            <button
              key={`${paramKey}-${optionValue}`}
              type="button"
              onClick={() => onToggle(paramKey, optionValue)}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)"
                  : "transparent",
                color: isActive ? "#fff" : "#555",
                fontSize: "12px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="flex h-3 w-3 items-center justify-center rounded-sm border flex-shrink-0 text-[8px] font-bold"
                  style={{
                    borderColor: isActive ? "#fff" : "#ddd",
                    background: isActive ? "#fff" : "transparent",
                    color: "#000",
                  }}
                >
                  {isActive && <Check />}
                </span>

                {option.label}
              </span>
              <span
                style={{
                  color: isActive ? "rgba(255,255,255,0.5)" : "#bbb",
                  fontSize: "11px",
                }}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SidebarContent({
  selectedCategories,
  selectedSubCategories,
  selectedSubSubCategories,
  selectedSpecificationFilters,
  categoryOptions,
  subCategoryOptions,
  subSubCategoryOptions,
  sidebarSpecificationGroups,
  hasActiveFilters,
  toggleFilter,
  onClearFilters,
}: {
  selectedCategories: string[];
  selectedSubCategories: string[];
  selectedSubSubCategories: string[];
  selectedSpecificationFilters: Record<string, string[]>;
  categoryOptions: ProductFilterOption[];
  subCategoryOptions: ProductFilterOption[];
  subSubCategoryOptions: ProductFilterOption[];
  sidebarSpecificationGroups: SidebarFilterGroup[];
  hasActiveFilters: boolean;
  toggleFilter: (paramKey: string, value: string) => void;
  onClearFilters?: () => void;
}) {
  return (
    <>
      <SidebarFilterSection
        title="Categories"
        paramKey={CATEGORY_PARAM}
        activeValues={selectedCategories}
        options={categoryOptions}
        onToggle={toggleFilter}
      />
      {selectedCategories.length > 0 && (
        <SidebarFilterSection
          title="Sub Categories"
          paramKey={SUB_CATEGORY_PARAM}
          activeValues={selectedSubCategories}
          options={subCategoryOptions}
          onToggle={toggleFilter}
        />
      )}
      {selectedSubCategories.length > 0 && (
        <SidebarFilterSection
          title="Sub Sub Categories"
          paramKey={SUB_SUB_CATEGORY_PARAM}
          activeValues={selectedSubSubCategories}
          options={subSubCategoryOptions}
          onToggle={toggleFilter}
        />
      )}
      {sidebarSpecificationGroups.map((group) => (
        <SidebarFilterSection
          key={group.key}
          title={formatFilterLabel(group.label)}
          paramKey={group.key}
          activeValues={selectedSpecificationFilters[group.key] ?? []}
          options={group.values}
          onToggle={toggleFilter}
        />
      ))}
      {hasActiveFilters && onClearFilters && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-widest transition-colors"
            style={{
              border: "1px solid #f0e0dc",
              color: "#d94f4f",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
            }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Help card */}
      <div
        className="mt-8 rounded-2xl px-5 py-6"
        style={{
          background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
          color: "#fff",
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Trade Support
        </p>
        <p
          className="mt-3 text-xl italic"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Need help sourcing?
        </p>
        <p
          className="mt-2 text-xs leading-5"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Reach out for custom sourcing and bulk requirements.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{
            background: "#fff",
            color: "#1a1a1a",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Contact Us
        </button>
      </div>
    </>
  );
}

export function ProductsPageDetails({
  mode = "default",
}: {
  mode?: "default" | "special";
}) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isSpecialSession, specialUser } = useAuth();
  const isSpecialCatalog = mode === "special";
  const allowedCategoryIds = useMemo(
    () =>
      isSpecialSession && specialUser?.allowedCategories.length
        ? new Set(specialUser.allowedCategories)
        : null,
    [isSpecialSession, specialUser],
  );

  const selectedCategories = useMemo(
    () => getSelectedValues(searchParams, CATEGORY_PARAM),
    [searchParams],
  );
  const selectedSubCategories = useMemo(
    () => getSelectedValues(searchParams, SUB_CATEGORY_PARAM),
    [searchParams],
  );
  const selectedSubSubCategories = useMemo(
    () => getSelectedValues(searchParams, SUB_SUB_CATEGORY_PARAM),
    [searchParams],
  );

  const selectedSpecificationFilters = useMemo(
    () =>
      filters.specifications.reduce<Record<string, string[]>>((acc, group) => {
        const selectedValues = getSelectedValues(searchParams, group.key);
        if (selectedValues.length) acc[group.key] = selectedValues;
        return acc;
      }, {}),
    [filters.specifications, searchParams],
  );

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const [productsResponse, filtersResponse] = await Promise.all([
          getAllProducts(),
          getProductFilters(),
        ]);
        setProducts(productsResponse.products ?? []);
        setFilters(filtersResponse.filters ?? EMPTY_FILTERS);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load products.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchPageData();
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [searchParams]);
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const visibleProducts = useMemo(
    () =>
      products.filter((p) => isProductVisibleForSession(p, isSpecialSession)),
    [products, isSpecialSession],
  );

  const scopedProducts = useMemo(() => {
    const base = isSpecialCatalog
      ? visibleProducts.filter((p) =>
          isProductAllowedForCategoryIds(p, allowedCategoryIds),
        )
      : visibleProducts;
    return isSpecialCatalog ? sortSpecialProductsFirst(base) : base;
  }, [allowedCategoryIds, isSpecialCatalog, visibleProducts]);

  const scopedFilters = useMemo<FiltersState>(() => {
    if (!isSpecialCatalog || !allowedCategoryIds) return filters;
    const scopedCatIds = new Set(
      scopedProducts
        .map((p) => getProductRefId(p.categoryId as ProductRef))
        .filter(Boolean) as string[],
    );
    const scopedSubCatIds = new Set(
      scopedProducts
        .map((p) => getProductRefId(p.subCategoryId as ProductRef))
        .filter(Boolean) as string[],
    );
    const scopedSubSubCatIds = new Set(
      scopedProducts
        .map((p) => getProductRefId(p.subSubCategoryId as ProductRef))
        .filter(Boolean) as string[],
    );
    return {
      categories: filters.categories.filter(
        (c) => c.id && scopedCatIds.has(c.id),
      ),
      subCategories: filters.subCategories.filter(
        (c) => c.id && scopedSubCatIds.has(c.id),
      ),
      subSubCategories: filters.subSubCategories.filter(
        (c) => c.id && scopedSubSubCatIds.has(c.id),
      ),
      specifications: filters.specifications,
    };
  }, [allowedCategoryIds, filters, isSpecialCatalog, scopedProducts]);

  const visibleSubCategories = useMemo(
    () =>
      !selectedCategories.length
        ? []
        : scopedFilters.subCategories.filter(
            (sub) => sub.parentId && selectedCategories.includes(sub.parentId),
          ),
    [scopedFilters.subCategories, selectedCategories],
  );

  const visibleSubSubCategories = useMemo(
    () =>
      !selectedSubCategories.length
        ? []
        : scopedFilters.subSubCategories.filter(
            (sub) =>
              sub.parentId && selectedSubCategories.includes(sub.parentId),
          ),
    [scopedFilters.subSubCategories, selectedSubCategories],
  );

  const matchesSpecificationFilters = (
    product: ProductRecord,
    specificationFilters: Record<string, string[]>,
  ) => {
    for (const [key, selectedValues] of Object.entries(specificationFilters)) {
      if (!selectedValues.length) continue;
      const hasMatch = product.specifications.some(
        (spec) =>
          spec.key.trim().toLowerCase() === key &&
          selectedValues.includes(spec.value),
      );
      if (!hasMatch) return false;
    }
    return true;
  };

  const getProductsForCounts = useCallback(
    ({ ignoreParamKey }: { ignoreParamKey?: string }) =>
      scopedProducts.filter((product) => {
        const categoryId = getProductRefId(product.categoryId as ProductRef);
        const subCategoryId = getProductRefId(
          product.subCategoryId as ProductRef,
        );
        const subSubCategoryId = getProductRefId(
          product.subSubCategoryId as ProductRef,
        );
        if (
          ignoreParamKey !== CATEGORY_PARAM &&
          !matchesMultiValueFilter(selectedCategories, categoryId)
        )
          return false;
        if (
          ignoreParamKey !== SUB_CATEGORY_PARAM &&
          !matchesMultiValueFilter(selectedSubCategories, subCategoryId)
        )
          return false;
        if (
          ignoreParamKey !== SUB_SUB_CATEGORY_PARAM &&
          !matchesMultiValueFilter(selectedSubSubCategories, subSubCategoryId)
        )
          return false;
        const specFilters =
          ignoreParamKey &&
          ![
            CATEGORY_PARAM,
            SUB_CATEGORY_PARAM,
            SUB_SUB_CATEGORY_PARAM,
          ].includes(ignoreParamKey)
            ? Object.fromEntries(
                Object.entries(selectedSpecificationFilters).filter(
                  ([key]) => key !== ignoreParamKey,
                ),
              )
            : selectedSpecificationFilters;
        return matchesSpecificationFilters(product, specFilters);
      }),
    [
      scopedProducts,
      selectedCategories,
      selectedSpecificationFilters,
      selectedSubCategories,
      selectedSubSubCategories,
    ],
  );

  const filteredProducts = useMemo(
    () =>
      scopedProducts.filter((product) => {
        const categoryId = getProductRefId(product.categoryId as ProductRef);
        const subCategoryId = getProductRefId(
          product.subCategoryId as ProductRef,
        );
        const subSubCategoryId = getProductRefId(
          product.subSubCategoryId as ProductRef,
        );
        if (!matchesMultiValueFilter(selectedCategories, categoryId))
          return false;
        if (!matchesMultiValueFilter(selectedSubCategories, subCategoryId))
          return false;
        if (
          !matchesMultiValueFilter(selectedSubSubCategories, subSubCategoryId)
        )
          return false;
        return matchesSpecificationFilters(
          product,
          selectedSpecificationFilters,
        );
      }),
    [
      scopedProducts,
      selectedCategories,
      selectedSpecificationFilters,
      selectedSubCategories,
      selectedSubSubCategories,
    ],
  );

  const categoryOptions = useMemo(() => {
    const base = getProductsForCounts({ ignoreParamKey: CATEGORY_PARAM });
    return scopedFilters.categories
      .map((o) => ({
        ...o,
        count: base.filter(
          (p) => getProductRefId(p.categoryId as ProductRef) === o.id,
        ).length,
      }))
      .filter((o) => o.count > 0 || selectedCategories.includes(o.id ?? ""));
  }, [getProductsForCounts, scopedFilters.categories, selectedCategories]);

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategories.length) return [];
    const base = getProductsForCounts({ ignoreParamKey: SUB_CATEGORY_PARAM });
    return visibleSubCategories
      .map((o) => ({
        ...o,
        count: base.filter(
          (p) => getProductRefId(p.subCategoryId as ProductRef) === o.id,
        ).length,
      }))
      .filter((o) => o.count > 0 || selectedSubCategories.includes(o.id ?? ""));
  }, [
    getProductsForCounts,
    selectedCategories.length,
    selectedSubCategories,
    visibleSubCategories,
  ]);

  const subSubCategoryOptions = useMemo(() => {
    if (!selectedSubCategories.length) return [];
    const base = getProductsForCounts({
      ignoreParamKey: SUB_SUB_CATEGORY_PARAM,
    });
    return visibleSubSubCategories
      .map((o) => ({
        ...o,
        count: base.filter(
          (p) => getProductRefId(p.subSubCategoryId as ProductRef) === o.id,
        ).length,
      }))
      .filter(
        (o) => o.count > 0 || selectedSubSubCategories.includes(o.id ?? ""),
      );
  }, [
    getProductsForCounts,
    selectedSubCategories,
    selectedSubSubCategories,
    visibleSubSubCategories,
  ]);

  const sidebarSpecificationGroups = useMemo<SidebarFilterGroup[]>(
    () =>
      scopedFilters.specifications
        .map((group) => {
          const base = getProductsForCounts({ ignoreParamKey: group.key });
          return {
            key: group.key,
            label: group.label,
            values: group.values
              .map((o) => ({
                ...o,
                count: base.filter((p) =>
                  p.specifications.some(
                    (spec) =>
                      spec.key.trim().toLowerCase() === group.key &&
                      spec.value === (o.value ?? o.label),
                  ),
                ).length,
              }))
              .filter(
                (o) =>
                  o.count > 0 ||
                  (o.value &&
                    (selectedSpecificationFilters[group.key] ?? []).includes(
                      o.value,
                    )),
              ),
          };
        })
        .filter((g) => g.values.length > 0),
    [
      getProductsForCounts,
      scopedFilters.specifications,
      selectedSpecificationFilters,
    ],
  );

  const activeTitle = useMemo(() => {
    if (selectedSubSubCategories.length)
      return `${selectedSubSubCategories.length} sub-sub-category selections`;
    if (selectedSubCategories.length)
      return `${selectedSubCategories.length} sub-category selections`;
    if (selectedCategories.length)
      return `${selectedCategories.length} category selections`;
    if (isSpecialCatalog) return "Your special catalog";
    return "All Products";
  }, [
    isSpecialCatalog,
    selectedCategories,
    selectedSubCategories,
    selectedSubSubCategories,
  ]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSubCategories.length > 0 ||
    selectedSubSubCategories.length > 0 ||
    Object.keys(selectedSpecificationFilters).length > 0;

  const activeFilterCount =
    selectedCategories.length +
    selectedSubCategories.length +
    selectedSubSubCategories.length +
    Object.keys(selectedSpecificationFilters).length;

  const basePath = isSpecialCatalog ? "/special/products" : "/products";

  const toggleFilter = (paramKey: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = getSelectedValues(params, paramKey);
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    params.delete(paramKey);
    nextValues.forEach((item) => params.append(paramKey, item));

    if (paramKey === CATEGORY_PARAM) {
      const allowedSubs = filters.subCategories
        .filter((s) => s.parentId && nextValues.includes(s.parentId))
        .map((s) => s.id)
        .filter(Boolean) as string[];
      const nextSubs = getSelectedValues(params, SUB_CATEGORY_PARAM).filter(
        (i) => allowedSubs.includes(i),
      );
      params.delete(SUB_CATEGORY_PARAM);
      nextSubs.forEach((i) => params.append(SUB_CATEGORY_PARAM, i));
      const allowedSubSubs = filters.subSubCategories
        .filter((s) => s.parentId && nextSubs.includes(s.parentId))
        .map((s) => s.id)
        .filter(Boolean) as string[];
      const nextSubSubs = getSelectedValues(
        params,
        SUB_SUB_CATEGORY_PARAM,
      ).filter((i) => allowedSubSubs.includes(i));
      params.delete(SUB_SUB_CATEGORY_PARAM);
      nextSubSubs.forEach((i) => params.append(SUB_SUB_CATEGORY_PARAM, i));
    }

    if (paramKey === SUB_CATEGORY_PARAM) {
      const allowedSubSubs = filters.subSubCategories
        .filter((s) => s.parentId && nextValues.includes(s.parentId))
        .map((s) => s.id)
        .filter(Boolean) as string[];
      const nextSubSubs = getSelectedValues(
        params,
        SUB_SUB_CATEGORY_PARAM,
      ).filter((i) => allowedSubSubs.includes(i));
      params.delete(SUB_SUB_CATEGORY_PARAM);
      nextSubSubs.forEach((i) => params.append(SUB_SUB_CATEGORY_PARAM, i));
    }

    const query = params.toString();
    router.replace(query ? `${basePath}?${query}` : basePath);
  };

  const handleClearFilters = () => router.replace(basePath);

  const sharedSidebarProps = {
    selectedCategories,
    selectedSubCategories,
    selectedSubSubCategories,
    selectedSpecificationFilters,
    categoryOptions,
    subCategoryOptions,
    subSubCategoryOptions,
    sidebarSpecificationGroups,
    hasActiveFilters,
    toggleFilter,
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Special session banner */}
      {isSpecialCatalog && isSpecialSession && (
        <div
          className="px-6 py-2.5 text-center text-xs font-medium uppercase tracking-widest"
          style={{ background: "#1a1a1a", color: "rgba(255,255,255,0.7)" }}
        >
          Special catalog active —{" "}
          <span className="text-white">
            {specialUser?.allowedCategories.length} categories
          </span>{" "}
          available
        </div>
      )}

      <main className="flex-1 pb-16 pt-6 mt-8">
        <section className="px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Mobile filter toggle */}
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#888" }}
              >
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors"
                style={{
                  border: "1px solid #f0e0dc",
                  background: "#fff",
                  color: "#1a1a1a",
                }}
              >
                <SlidersHorizontal size={13} />
                Filters
                {hasActiveFilters && (
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
                    style={{ background: "#d94f4f" }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile sidebar drawer */}
            {isSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                  onClick={() => setIsSidebarOpen(false)}
                />
                <aside className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">
                  <div className="flex justify-center pb-1 pt-3">
                    <div className="h-1 w-10 rounded-full bg-gray-200" />
                  </div>
                  <div className="px-6 pb-10">
                    <div
                      className="flex items-center justify-between border-b py-4"
                      style={{ borderColor: "#f0e0dc" }}
                    >
                      <div>
                        <p
                          className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                          style={{ color: "#d94f4f" }}
                        >
                          Catalog Filters
                        </p>
                        <h2
                          className="mt-1 text-2xl italic"
                          style={{
                            fontFamily: "'Georgia', serif",
                            color: "#1a1a1a",
                          }}
                        >
                          Refine selection
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ background: "#f5f5f5", color: "#555" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <SidebarContent
                      {...sharedSidebarProps}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                </aside>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              {/* Desktop sidebar */}
              <aside
                className="hidden h-fit rounded-2xl p-6 lg:sticky lg:top-28 lg:block"
                style={{ background: "#fdf5f3", border: "1px solid #f0e0dc" }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: "#d94f4f" }}
                >
                  Catalog Filters
                </p>
                <h2
                  className="mt-2 text-2xl italic"
                  style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a" }}
                >
                  Refine selection
                </h2>
                <p className="mt-3 text-xs leading-5" style={{ color: "#888" }}>
                  Select a category first. Sub-categories appear after parent
                  selections are made.
                </p>
                <SidebarContent {...sharedSidebarProps} />
              </aside>

              {/* Main content */}
              <div>
                {/* Results header */}
                <div
                  className="mb-6 flex flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{ background: "#fdf5f3", border: "1px solid #f0e0dc" }}
                >
                  <div>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                      style={{ color: "#d94f4f" }}
                    >
                      Live Inventory
                    </p>
                    <h2
                      className="mt-1 text-xl italic"
                      style={{
                        fontFamily: "'Georgia', serif",
                        color: "#1a1a1a",
                      }}
                    >
                      {activeTitle}
                    </h2>
                  </div>
                  <p className="text-xs" style={{ color: "#888" }}>
                    Showing{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#1a1a1a" }}
                    >
                      {filteredProducts.length}
                    </span>
                    {scopedProducts.length !== filteredProducts.length && (
                      <span style={{ color: "#bbb" }}>
                        {" "}
                        of {scopedProducts.length}
                      </span>
                    )}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}
                    {hasActiveFilters && (
                      <Link
                        href={basePath}
                        className="ml-3 underline underline-offset-2 transition-colors hover:text-gray-700"
                        style={{ color: "#d94f4f", fontSize: "11px" }}
                      >
                        Clear filters
                      </Link>
                    )}
                  </p>
                </div>

                {/* Products grid */}
                {loadError ? (
                  <div
                    className="rounded-2xl px-6 py-8 text-center text-sm"
                    style={{
                      background: "#fdf5f3",
                      border: "1px solid #f0e0dc",
                      color: "#d94f4f",
                    }}
                  >
                    {loadError}
                  </div>
                ) : isLoading ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl bg-gray-100"
                        style={{ aspectRatio: "3/4" }}
                      />
                    ))}
                  </div>
                ) : filteredProducts.length ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        name={product.name}
                        image={getProductPrimaryImage(product)}
                        href={getProductHref(product)}
                        badges={product.badges}
                        isSpecial={product.isSpecial}
                        details={{
                          sku: product.sku,
                          composition: getProductSpecification(
                            product,
                            "composition",
                          ),
                          color: getProductDisplayColor(product),
                          width: getProductSpecification(product, "width"),
                          weight: getProductSpecification(product, "weight"),
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-2xl px-6 py-14 text-center"
                    style={{
                      background: "#fdf5f3",
                      border: "1px solid #f0e0dc",
                    }}
                  >
                    <p
                      className="text-2xl italic"
                      style={{
                        fontFamily: "'Georgia', serif",
                        color: "#1a1a1a",
                      }}
                    >
                      No products found
                    </p>
                    <p className="mt-3 text-xs" style={{ color: "#888" }}>
                      No results match the current filters.{" "}
                      <Link
                        href={basePath}
                        className="underline underline-offset-2"
                        style={{ color: "#d94f4f" }}
                      >
                        View all products
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense>
      <ProductsPageDetails mode="default" />
    </Suspense>
  );
}

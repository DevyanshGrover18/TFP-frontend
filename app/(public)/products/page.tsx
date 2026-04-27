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
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getSelectedValues = (searchParams: URLSearchParams, key: string) =>
  Array.from(new Set(searchParams.getAll(key).filter(Boolean)));

const getProductRefId = (value: ProductRef | undefined) =>
  typeof value === "string" ? value : value?._id ?? value?.id;

const matchesMultiValueFilter = (
  selectedValues: string[],
  candidate: string | undefined,
) => {
  if (!selectedValues.length) return true;
  return candidate ? selectedValues.includes(candidate) : false;
};

// ─── Sidebar filter section ───────────────────────────────────────────────────

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
    <div className="mt-8 border-t border-stone-200 pt-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
        {title}
      </p>
      <div className="mt-4 flex flex-col gap-1.5">
        {options.map((option) => {
          const optionValue = option.id ?? option.value ?? option.label;
          const isActive = activeValues.includes(optionValue);

          return (
            <button
              key={`${paramKey}-${optionValue}`}
              type="button"
              onClick={() => onToggle(paramKey, optionValue)}
              className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-sm border ${
                    isActive
                      ? "border-white bg-white"
                      : "border-stone-300 bg-transparent"
                  }`}
                />
                <span>{option.label}</span>
              </span>
              <span
                className={`${isActive ? "text-white/70" : "text-stone-400"}`}
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

// ─── Sidebar content (shared between desktop & mobile drawer) ─────────────────

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
            className="block w-full rounded-2xl border border-stone-200 py-3 text-center text-xs font-semibold uppercase tracking-widest text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      <div className="mt-8 rounded-[1.5rem] bg-stone-900 px-5 py-6 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
          Trade Support
        </p>
        <p
          className="mt-3 text-2xl italic"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Need help sourcing?
        </p>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Start with the live catalog filters, then reach out for custom
          sourcing and bulk requirements.
        </p>
        <button
          type="button"
          className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-900"
        >
          Contact Studio
        </button>
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const ProductsPageDetails = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Auth: get allowed categories for special session ──
  const { isSpecialSession, specialUser } = useAuth();
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

  // Close sidebar on route change (filter toggle navigates)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [searchParams]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // ── Products scoped to special session ───────────────────────────────────
  const scopedProducts = useMemo(() => {
    if (!allowedCategoryIds) return products;

    return products.filter((product) => {
      const catId = getProductRefId(product.categoryId as ProductRef);
      const subCatId = getProductRefId(product.subCategoryId as ProductRef);
      const subSubCatId = getProductRefId(
        product.subSubCategoryId as ProductRef,
      );

      return (
        (catId && allowedCategoryIds.has(catId)) ||
        (subCatId && allowedCategoryIds.has(subCatId)) ||
        (subSubCatId && allowedCategoryIds.has(subSubCatId))
      );
    });
  }, [products, allowedCategoryIds]);

  // ── Scoped filters ───────────────────────────────────────────────────────
  const scopedFilters = useMemo<FiltersState>(() => {
    if (!allowedCategoryIds) return filters;

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
  }, [filters, scopedProducts, allowedCategoryIds]);

  const visibleSubCategories = useMemo(() => {
    if (!selectedCategories.length) return [];
    return scopedFilters.subCategories.filter(
      (sub) => sub.parentId && selectedCategories.includes(sub.parentId),
    );
  }, [scopedFilters.subCategories, selectedCategories]);

  const visibleSubSubCategories = useMemo(() => {
    if (!selectedSubCategories.length) return [];
    return scopedFilters.subSubCategories.filter(
      (sub) => sub.parentId && selectedSubCategories.includes(sub.parentId),
    );
  }, [scopedFilters.subSubCategories, selectedSubCategories]);

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

        const specificationFilters =
          ignoreParamKey &&
          ignoreParamKey !== CATEGORY_PARAM &&
          ignoreParamKey !== SUB_CATEGORY_PARAM &&
          ignoreParamKey !== SUB_SUB_CATEGORY_PARAM
            ? Object.fromEntries(
                Object.entries(selectedSpecificationFilters).filter(
                  ([key]) => key !== ignoreParamKey,
                ),
              )
            : selectedSpecificationFilters;

        return matchesSpecificationFilters(product, specificationFilters);
      }),
    [
      scopedProducts,
      selectedCategories,
      selectedSubCategories,
      selectedSubSubCategories,
      selectedSpecificationFilters,
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
      selectedSubCategories,
      selectedSubSubCategories,
      selectedSpecificationFilters,
    ],
  );

  const categoryOptions = useMemo(() => {
    const baseProducts = getProductsForCounts({
      ignoreParamKey: CATEGORY_PARAM,
    });
    return scopedFilters.categories
      .map((option) => ({
        ...option,
        count: baseProducts.filter(
          (p) => getProductRefId(p.categoryId as ProductRef) === option.id,
        ).length,
      }))
      .filter(
        (option) =>
          option.count > 0 || selectedCategories.includes(option.id ?? ""),
      );
  }, [scopedFilters.categories, selectedCategories, getProductsForCounts]);

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategories.length) return [];
    const baseProducts = getProductsForCounts({
      ignoreParamKey: SUB_CATEGORY_PARAM,
    });
    return visibleSubCategories
      .map((option) => ({
        ...option,
        count: baseProducts.filter(
          (p) => getProductRefId(p.subCategoryId as ProductRef) === option.id,
        ).length,
      }))
      .filter(
        (option) =>
          option.count > 0 || selectedSubCategories.includes(option.id ?? ""),
      );
  }, [
    visibleSubCategories,
    selectedCategories.length,
    selectedSubCategories,
    getProductsForCounts,
  ]);

  const subSubCategoryOptions = useMemo(() => {
    if (!selectedSubCategories.length) return [];
    const baseProducts = getProductsForCounts({
      ignoreParamKey: SUB_SUB_CATEGORY_PARAM,
    });
    return visibleSubSubCategories
      .map((option) => ({
        ...option,
        count: baseProducts.filter(
          (p) =>
            getProductRefId(p.subSubCategoryId as ProductRef) === option.id,
        ).length,
      }))
      .filter(
        (option) =>
          option.count > 0 ||
          selectedSubSubCategories.includes(option.id ?? ""),
      );
  }, [
    visibleSubSubCategories,
    selectedSubCategories,
    selectedSubSubCategories,
    getProductsForCounts,
  ]);

  const sidebarSpecificationGroups = useMemo<SidebarFilterGroup[]>(
    () =>
      filters.specifications
        .map((group) => {
          const baseProducts = getProductsForCounts({
            ignoreParamKey: group.key,
          });
          return {
            key: group.key,
            label: group.label,
            values: group.values
              .map((option) => {
                const optionValue = option.value ?? option.label;
                return {
                  ...option,
                  count: baseProducts.filter((p) =>
                    p.specifications.some(
                      (spec) =>
                        spec.key.trim().toLowerCase() === group.key &&
                        spec.value === optionValue,
                    ),
                  ).length,
                };
              })
              .filter(
                (option) =>
                  option.count > 0 ||
                  (option.value &&
                    (selectedSpecificationFilters[group.key] ?? []).includes(
                      option.value,
                    )),
              ),
          };
        })
        .filter((group) => group.values.length > 0),
    [
      filters.specifications,
      selectedSpecificationFilters,
      getProductsForCounts,
    ],
  );

  const activeTitle = useMemo(() => {
    if (selectedSubSubCategories.length)
      return `${selectedSubSubCategories.length} sub-sub-category selections`;
    if (selectedSubCategories.length)
      return `${selectedSubCategories.length} sub-category selections`;
    if (selectedCategories.length)
      return `${selectedCategories.length} category selections`;
    return isSpecialSession ? "Your catalog" : "All products";
  }, [
    selectedCategories,
    selectedSubCategories,
    selectedSubSubCategories,
    isSpecialSession,
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

  const toggleFilter = (paramKey: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = getSelectedValues(params, paramKey);
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    params.delete(paramKey);
    nextValues.forEach((item) => params.append(paramKey, item));

    if (paramKey === CATEGORY_PARAM) {
      const allowedSubCategories = filters.subCategories
        .filter((sub) => sub.parentId && nextValues.includes(sub.parentId))
        .map((sub) => sub.id)
        .filter(Boolean) as string[];

      const nextSubCategories = getSelectedValues(
        params,
        SUB_CATEGORY_PARAM,
      ).filter((item) => allowedSubCategories.includes(item));

      params.delete(SUB_CATEGORY_PARAM);
      nextSubCategories.forEach((item) =>
        params.append(SUB_CATEGORY_PARAM, item),
      );

      const allowedSubSubCategories = filters.subSubCategories
        .filter(
          (sub) => sub.parentId && nextSubCategories.includes(sub.parentId),
        )
        .map((sub) => sub.id)
        .filter(Boolean) as string[];

      const nextSubSubCategories = getSelectedValues(
        params,
        SUB_SUB_CATEGORY_PARAM,
      ).filter((item) => allowedSubSubCategories.includes(item));

      params.delete(SUB_SUB_CATEGORY_PARAM);
      nextSubSubCategories.forEach((item) =>
        params.append(SUB_SUB_CATEGORY_PARAM, item),
      );
    }

    if (paramKey === SUB_CATEGORY_PARAM) {
      const allowedSubSubCategories = filters.subSubCategories
        .filter((sub) => sub.parentId && nextValues.includes(sub.parentId))
        .map((sub) => sub.id)
        .filter(Boolean) as string[];

      const nextSubSubCategories = getSelectedValues(
        params,
        SUB_SUB_CATEGORY_PARAM,
      ).filter((item) => allowedSubSubCategories.includes(item));

      params.delete(SUB_SUB_CATEGORY_PARAM);
      nextSubSubCategories.forEach((item) =>
        params.append(SUB_SUB_CATEGORY_PARAM, item),
      );
    }

    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products");
  };

  const handleClearFilters = () => {
    router.replace("/products");
  };

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
    <div className="flex min-h-screen flex-col bg-[#f6f2ea] text-stone-900">
      {isSpecialSession && (
        <div className="bg-stone-900 px-6 py-2.5 text-center text-xs font-medium uppercase tracking-widest text-white/70">
          Special session active —{" "}
          <span className="text-white">
            {specialUser?.allowedCategories.length} categories
          </span>{" "}
          in your catalog
        </div>
      )}

      <main className="flex-1 pb-16 pt-4">
        <section className="mt-8 px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">

            {/* ── Mobile filter toggle bar ──────────────────────────────── */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-stone-700 shadow-sm active:bg-stone-100 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h18M6 8h12M9 12h6"
                  />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* ── Mobile sidebar drawer ─────────────────────────────────── */}
            {isSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setIsSidebarOpen(false)}
                />
                {/* Bottom sheet */}
                <aside className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl">
                  {/* Handle bar */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-stone-200" />
                  </div>

                  <div className="px-6 pb-10">
                    <div className="flex items-center justify-between py-4 border-b border-stone-100">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                          Catalog Filters
                        </p>
                        <h2
                          className="mt-1 text-2xl italic text-stone-900"
                          style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                          }}
                        >
                          Refined selection
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-stone-700 hover:bg-stone-200 transition-colors"
                      >
                        Done
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

            {/* ── Main grid ────────────────────────────────────────────── */}
            <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">

              {/* Desktop sidebar — hidden on mobile */}
              <aside className="hidden h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm lg:block lg:sticky lg:top-28">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                    Catalog Filters
                  </p>
                  <h2
                    className="mt-3 text-3xl italic text-stone-900"
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                  >
                    Refined selection
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-stone-600">
                    Select one or more categories first. Sub-categories and
                    sub-sub-categories only appear after their parent selections
                    are made.
                  </p>
                </div>

                <SidebarContent {...sharedSidebarProps} />
              </aside>

              {/* ── Product grid ──────────────────────────────────────── */}
              <div>
                <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Live Inventory
                    </p>
                    <h2
                      className="mt-2 text-2xl italic text-stone-900 sm:text-3xl"
                      style={{
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                      }}
                    >
                      {activeTitle}
                    </h2>
                  </div>
                  <p className="text-sm text-stone-600">
                    Showing{" "}
                    <span className="font-semibold text-stone-900">
                      {filteredProducts.length}
                    </span>
                    {scopedProducts.length !== filteredProducts.length && (
                      <span className="text-stone-400">
                        {" "}
                        of {scopedProducts.length}
                      </span>
                    )}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}
                    {hasActiveFilters && (
                      <Link
                        href="/products"
                        className="ml-3 text-xs text-stone-400 underline underline-offset-2 transition-colors hover:text-stone-700"
                      >
                        Clear filters
                      </Link>
                    )}
                  </p>
                </div>

                {loadError ? (
                  <div className="rounded-[2rem] border border-[#ead5cc] bg-white px-6 py-8 text-sm text-[#7b4e3c] shadow-sm">
                    {loadError}
                  </div>
                ) : isLoading ? (
                  <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-14 text-center text-sm text-stone-500 shadow-sm">
                    Loading products...
                  </div>
                ) : filteredProducts.length ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        name={product.name}
                        image={getProductPrimaryImage(product)}
                        href={getProductHref(product)}
                        badges={product.badges}
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
                  <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
                    <p
                      className="text-3xl italic text-stone-900"
                      style={{
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                      }}
                    >
                      No products found
                    </p>
                    <p className="mt-3 text-sm text-stone-500">
                      No results match the current filters.{" "}
                      <Link
                        href="/products"
                        className="underline underline-offset-2 transition-colors hover:text-stone-800"
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
};

export default function ProductPage() {
  return (
    <Suspense>
      <ProductsPageDetails />
    </Suspense>
  );
}
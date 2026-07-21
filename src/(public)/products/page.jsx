"use client";

import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState } from
"react";
import ProductCard from "../../components/common/ProductCard";
import {
  getAllProducts,
  getProductDisplayColor,
  getProductFilters,
  getProductHref,
  getProductPrimaryImage,
  getProductSpecification } from



"../../services/productsService";
import { useAuth } from "@/context/AuthContext";
import {
  isProductAllowedForCategoryIds,
  isProductVisibleForSession,
  sortSpecialProductsFirst } from
"@/services/catalogAccess";
import { Check, SlidersHorizontal, X } from "lucide-react";
























const EMPTY_FILTERS = {
  categories: [],
  subCategories: [],
  subSubCategories: [],
  specifications: []
};

const EMPTY_SELECTED_FILTERS = {
  categories: [],
  subCategories: [],
  subSubCategories: [],
  specifications: {},
  query: ""
};

const CATEGORY_PARAM = "category";
const SUB_CATEGORY_PARAM = "subcategory";
const SUB_SUB_CATEGORY_PARAM = "subsubcategory";
const SEARCH_QUERY_PARAM = "q";

const formatFilterLabel = (value) =>
value.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const getSelectedValues = (searchParams, key) =>
Array.from(new Set(searchParams.getAll(key).filter(Boolean)));

const parseSelectedFilters = (
searchParams) =>
{
  const specifications = {};

  searchParams.forEach((_, key) => {
    if (
    key === CATEGORY_PARAM ||
    key === SUB_CATEGORY_PARAM ||
    key === SUB_SUB_CATEGORY_PARAM ||
    key === SEARCH_QUERY_PARAM // ← add this
    ) {
      return;
    }
    const values = getSelectedValues(searchParams, key);
    if (values.length) specifications[key] = values;
  });

  return {
    categories: getSelectedValues(searchParams, CATEGORY_PARAM),
    subCategories: getSelectedValues(searchParams, SUB_CATEGORY_PARAM),
    subSubCategories: getSelectedValues(searchParams, SUB_SUB_CATEGORY_PARAM),
    specifications,
    query: searchParams.get(SEARCH_QUERY_PARAM) || ""
  };
};

const buildFilterSearchParams = (selectedFilters) => {
  const params = new URLSearchParams();

  selectedFilters.categories.forEach((value) =>
  params.append(CATEGORY_PARAM, value)
  );
  selectedFilters.subCategories.forEach((value) =>
  params.append(SUB_CATEGORY_PARAM, value)
  );
  selectedFilters.subSubCategories.forEach((value) =>
  params.append(SUB_SUB_CATEGORY_PARAM, value)
  );

  Object.entries(selectedFilters.specifications).forEach(([key, values]) => {
    values.forEach((value) => params.append(key, value));
  });

  if (selectedFilters.query) {
    params.set(SEARCH_QUERY_PARAM, selectedFilters.query);
  }

  return params;
};

const getProductRefId = (value) =>
typeof value === "string" ? value : value?._id ?? value?.id;

const matchesMultiValueFilter = (
selectedValues,
candidate) =>
{
  if (!selectedValues.length) return true;
  return candidate ? selectedValues.includes(candidate) : false;
};

function SidebarFilterSection({
  title,
  paramKey,
  activeValues,
  options,
  onToggle






}) {
  if (!options.length) return null;

  return (
    <div className="mt-6 border-t pt-5" style={{ borderColor: "#f0e0dc" }}>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: "#d94f4f", fontFamily: "'DM Sans', sans-serif" }}>
        
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
                background: isActive ?
                "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)" :
                "transparent",
                color: isActive ? "#fff" : "#555",
                fontSize: "12px",
                fontFamily: "'DM Sans', sans-serif"
              }}>
              
              <span className="flex items-center gap-2">
                <span
                  className="flex h-3 w-3 items-center justify-center rounded-sm border flex-shrink-0 text-[8px] font-bold"
                  style={{
                    borderColor: isActive ? "#fff" : "#ddd",
                    background: isActive ? "#fff" : "transparent",
                    color: "#000"
                  }}>
                  
                  {isActive && <Check />}
                </span>

                {option.label}
              </span>
              <span
                style={{
                  color: isActive ? "rgba(255,255,255,0.5)" : "#bbb",
                  fontSize: "11px"
                }}>
                
                {option.count}
              </span>
            </button>);

        })}
      </div>
    </div>);

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
  onClearFilters












}) {
  console.log(categoryOptions);
  return (
    <>
      <SidebarFilterSection
        title="Categories"
        paramKey={CATEGORY_PARAM}
        activeValues={selectedCategories}
        options={categoryOptions}
        onToggle={toggleFilter} />
      
      {selectedCategories.length > 0 &&
      <SidebarFilterSection
        title="Sub Categories"
        paramKey={SUB_CATEGORY_PARAM}
        activeValues={selectedSubCategories}
        options={subCategoryOptions}
        onToggle={toggleFilter} />

      }
      {selectedSubCategories.length > 0 &&
      <SidebarFilterSection
        title="Sub Sub Categories"
        paramKey={SUB_SUB_CATEGORY_PARAM}
        activeValues={selectedSubSubCategories}
        options={subSubCategoryOptions}
        onToggle={toggleFilter} />

      }
      {sidebarSpecificationGroups.map((group) =>
      <SidebarFilterSection
        key={group.key}
        title={formatFilterLabel(group.label)}
        paramKey={group.key}
        activeValues={selectedSpecificationFilters[group.key] ?? []}
        options={group.values}
        onToggle={toggleFilter} />

      )}
      {hasActiveFilters && onClearFilters &&
      <div className="mt-6">
          <button
          type="button"
          onClick={onClearFilters}
          className="w-full rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-widest transition-colors"
          style={{
            border: "1px solid #f0e0dc",
            color: "#d94f4f",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px"
          }}>
          
            Clear all filters
          </button>
        </div>
      }

      {/* Help card */}
      <div
        className="mt-8 rounded-2xl px-5 py-6"
        style={{
          background: "linear-gradient(135deg, #E8654A 0%, #E8426A 100%)",
          color: "#fff"
        }}>
        
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: "rgba(255,255,255,0.5)" }}>
          
          Trade Support
        </p>
        <p
          className="mt-3 text-xl italic"
          style={{ fontFamily: "'Georgia', serif" }}>
          
          Need help sourcing?
        </p>
        <p
          className="mt-2 text-xs leading-5"
          style={{ color: "rgba(255,255,255,0.6)" }}>
          
          Reach out for custom sourcing and bulk requirements.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest"
          style={{
            background: "#fff",
            color: "#1a1a1a",
            fontFamily: "'DM Sans', sans-serif"
          }}>
          
          Contact Us
        </button>
      </div>
    </>);

}

const ProductResults = memo(function ProductResults({
  activeTitle,
  filteredProducts,
  hasActiveFilters,
  isLoading,
  loadError,
  onClearFilters,
  scopedProducts








}) {
  return (
    <div>
      <div
        className="mb-6 flex flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: "#fdf5f3", border: "1px solid #f0e0dc" }}>
        
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "#d94f4f" }}>
            
            Live Inventory
          </p>
          <h2
            className="mt-1 text-xl italic"
            style={{
              fontFamily: "'Georgia', serif",
              color: "#1a1a1a"
            }}>
            
            {activeTitle}
          </h2>
        </div>
        <p className="text-xs" style={{ color: "#888" }}>
          Showing{" "}
          <span className="font-semibold" style={{ color: "#1a1a1a" }}>
            {filteredProducts.length}
          </span>
          {scopedProducts.length !== filteredProducts.length &&
          <span style={{ color: "#bbb" }}> of {scopedProducts.length}</span>
          }{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
          {hasActiveFilters &&
          <button
            type="button"
            onClick={onClearFilters}
            className="ml-3 underline underline-offset-2 transition-colors hover:text-gray-700"
            style={{ color: "#d94f4f", fontSize: "11px" }}>
            
              Clear filters
            </button>
          }
        </p>
      </div>

      {loadError ?
      <div
        className="rounded-2xl px-6 py-8 text-center text-sm"
        style={{
          background: "#fdf5f3",
          border: "1px solid #f0e0dc",
          color: "#d94f4f"
        }}>
        
          {loadError}
        </div> :
      isLoading ?
      <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) =>
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-gray-100"
          style={{ aspectRatio: "3/4" }} />

        )}
        </div> :
      filteredProducts.length ?
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3">
          {filteredProducts.map((product) =>
        <ProductCard
          key={product._id}
          name={product.name}
          image={getProductPrimaryImage(product)}
          href={getProductHref(product)}
          badges={product.badges}
          isSpecial={product.isSpecial}
          details={{
            sku: product.sku,
            composition: getProductSpecification(product, "composition"),
            color: getProductDisplayColor(product),
            width: getProductSpecification(product, "width"),
            weight: getProductSpecification(product, "weight")
          }} />

        )}
        </div> :

      <div
        className="rounded-2xl px-6 py-14 text-center"
        style={{
          background: "#fdf5f3",
          border: "1px solid #f0e0dc"
        }}>
        
          <p
          className="text-2xl italic"
          style={{
            fontFamily: "'Georgia', serif",
            color: "#1a1a1a"
          }}>
          
            No products found
          </p>
          <p className="mt-3 text-xs" style={{ color: "#888" }}>
            No results match the current filters.{" "}
            <button
            type="button"
            onClick={onClearFilters}
            className="underline underline-offset-2"
            style={{ color: "#d94f4f" }}>
            
              View all products
            </button>
          </p>
        </div>
      }
    </div>);

});

export function ProductsPageDetails({
  mode = "default"


}) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedFilters, setSelectedFilters] = useState(
    () =>
    typeof window === "undefined" ?
    EMPTY_SELECTED_FILTERS :
    parseSelectedFilters(new URLSearchParams(window.location.search))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isSpecialSession, specialUser } = useAuth();
  const isSpecialCatalog = mode === "special";
  const allowedCategoryIds = useMemo(
    () =>
    isSpecialSession && specialUser?.allowedCategories.length ?
    new Set(specialUser.allowedCategories) :
    null,
    [isSpecialSession, specialUser]
  );

  const selectedCategories = selectedFilters.categories;
  const selectedSubCategories = selectedFilters.subCategories;
  const selectedSubSubCategories = selectedFilters.subSubCategories;
  const selectedSpecificationFilters = selectedFilters.specifications;

  useEffect(() => {
    setSelectedFilters(
      parseSelectedFilters(new URLSearchParams(window.location.search))
    );
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const [productsResponse, filtersResponse] = await Promise.all([
        getAllProducts(),
        getProductFilters()]
        );
        setProducts(productsResponse.products ?? []);
        setFilters(filtersResponse.filters ?? EMPTY_FILTERS);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load products."
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchPageData();
  }, []);

  const basePath = isSpecialCatalog ? "/special/products" : "/products";

  const syncUrlWithFilters = useCallback(
    (nextSelectedFilters) => {
      if (typeof window === "undefined") return;
      const query = buildFilterSearchParams(nextSelectedFilters).toString();
      const nextUrl = query ? `${basePath}?${query}` : basePath;
      window.history.replaceState(window.history.state, "", nextUrl);
    },
    [basePath]
  );

  useEffect(() => {
    const handlePopState = () => {
      setSelectedFilters(
        parseSelectedFilters(new URLSearchParams(window.location.search))
      );
      setIsSidebarOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const visibleProducts = useMemo(
    () =>
    products.filter((p) => isProductVisibleForSession(p, isSpecialSession)),
    [products, isSpecialSession]
  );

  const scopedProducts = useMemo(() => {
    const base = isSpecialCatalog ?
    visibleProducts.filter((p) =>
    isProductAllowedForCategoryIds(p, allowedCategoryIds)
    ) :
    visibleProducts;
    return isSpecialCatalog ? sortSpecialProductsFirst(base) : base;
  }, [allowedCategoryIds, isSpecialCatalog, visibleProducts]);

  const scopedFilters = useMemo(() => {
    if (!isSpecialCatalog || !allowedCategoryIds) return filters;
    const scopedCatIds = new Set(
      scopedProducts.
      map((p) => getProductRefId(p.categoryId)).
      filter(Boolean)
    );
    const scopedSubCatIds = new Set(
      scopedProducts.
      map((p) => getProductRefId(p.subCategoryId)).
      filter(Boolean)
    );
    const scopedSubSubCatIds = new Set(
      scopedProducts.
      map((p) => getProductRefId(p.subSubCategoryId)).
      filter(Boolean)
    );
    return {
      categories: filters.categories.filter(
        (c) => c.id && scopedCatIds.has(c.id)
      ),
      subCategories: filters.subCategories.filter(
        (c) => c.id && scopedSubCatIds.has(c.id)
      ),
      subSubCategories: filters.subSubCategories.filter(
        (c) => c.id && scopedSubSubCatIds.has(c.id)
      ),
      specifications: filters.specifications
    };
  }, [allowedCategoryIds, filters, isSpecialCatalog, scopedProducts]);

  const visibleSubCategories = useMemo(
    () =>
    !selectedCategories.length ?
    [] :
    scopedFilters.subCategories.filter(
      (sub) => sub.parentId && selectedCategories.includes(sub.parentId)
    ),
    [scopedFilters.subCategories, selectedCategories]
  );

  const visibleSubSubCategories = useMemo(
    () =>
    !selectedSubCategories.length ?
    [] :
    scopedFilters.subSubCategories.filter(
      (sub) =>
      sub.parentId && selectedSubCategories.includes(sub.parentId)
    ),
    [scopedFilters.subSubCategories, selectedSubCategories]
  );

  const matchesSpecificationFilters = (
  product,
  specificationFilters) =>
  {
    for (const [key, selectedValues] of Object.entries(specificationFilters)) {
      if (!selectedValues.length) continue;
      const hasMatch = product.specifications.some(
        (spec) =>
        spec.key.trim().toLowerCase() === key &&
        selectedValues.includes(spec.value)
      );
      if (!hasMatch) return false;
    }
    return true;
  };

  const matchesSearchQuery = (product, query) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();

    return (
      product.name.toLowerCase().includes(q) ||
      typeof product.categoryId === "object" &&
      product.categoryId?.name?.toLowerCase().includes(q) ||
      typeof product.subCategoryId === "object" &&
      product.subCategoryId?.name?.toLowerCase().includes(q) ||
      typeof product.subSubCategoryId === "object" &&
      product.subSubCategoryId?.name?.toLowerCase().includes(q) ||
      product.tags?.some((t) => t.toLowerCase().includes(q)) ||
      product.sku.toLowerCase().includes(q));

  };

  const getProductsForCounts = useCallback(
    ({ ignoreParamKey }) =>
    scopedProducts.filter((product) => {
      const categoryId = getProductRefId(product.categoryId);
      const subCategoryId = getProductRefId(
        product.subCategoryId
      );
      const subSubCategoryId = getProductRefId(
        product.subSubCategoryId
      );
      if (
      ignoreParamKey !== CATEGORY_PARAM &&
      !matchesMultiValueFilter(selectedCategories, categoryId))

      return false;
      if (
      ignoreParamKey !== SUB_CATEGORY_PARAM &&
      !matchesMultiValueFilter(selectedSubCategories, subCategoryId))

      return false;
      if (
      ignoreParamKey !== SUB_SUB_CATEGORY_PARAM &&
      !matchesMultiValueFilter(selectedSubSubCategories, subSubCategoryId))

      return false;
      const specFilters =
      ignoreParamKey &&
      ![
      CATEGORY_PARAM,
      SUB_CATEGORY_PARAM,
      SUB_SUB_CATEGORY_PARAM].
      includes(ignoreParamKey) ?
      Object.fromEntries(
        Object.entries(selectedSpecificationFilters).filter(
          ([key]) => key !== ignoreParamKey
        )
      ) :
      selectedSpecificationFilters;
      if (!matchesSpecificationFilters(product, specFilters)) return false;
      return matchesSearchQuery(product, selectedFilters.query);
    }),
    [
    scopedProducts,
    selectedCategories,
    selectedFilters.query,
    selectedSpecificationFilters,
    selectedSubCategories,
    selectedSubSubCategories]

  );

  const filteredProducts = useMemo(
    () =>
    scopedProducts.filter((product) => {
      const categoryId = getProductRefId(product.categoryId);
      const subCategoryId = getProductRefId(
        product.subCategoryId
      );
      const subSubCategoryId = getProductRefId(
        product.subSubCategoryId
      );
      if (!matchesMultiValueFilter(selectedCategories, categoryId))
      return false;
      if (!matchesMultiValueFilter(selectedSubCategories, subCategoryId))
      return false;
      if (
      !matchesMultiValueFilter(selectedSubSubCategories, subSubCategoryId))

      return false;
      if (!matchesSpecificationFilters(product, selectedSpecificationFilters))
      return false;
      return matchesSearchQuery(product, selectedFilters.query);
    }),
    [
    scopedProducts,
    selectedCategories,
    selectedFilters.query,
    selectedSpecificationFilters,
    selectedSubCategories,
    selectedSubSubCategories]

  );

  const categoryOptions = useMemo(() => {
    const base = getProductsForCounts({ ignoreParamKey: CATEGORY_PARAM });
    return scopedFilters.categories.
    map((o) => ({
      ...o,
      count: base.filter(
        (p) => getProductRefId(p.categoryId) === o.id
      ).length
    })).
    filter((o) => o.count > 0 || selectedCategories.includes(o.id ?? ""));
  }, [getProductsForCounts, scopedFilters.categories, selectedCategories]);

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategories.length) return [];
    const base = getProductsForCounts({ ignoreParamKey: SUB_CATEGORY_PARAM });
    return visibleSubCategories.
    map((o) => ({
      ...o,
      count: base.filter(
        (p) => getProductRefId(p.subCategoryId) === o.id
      ).length
    })).
    filter((o) => o.count > 0 || selectedSubCategories.includes(o.id ?? ""));
  }, [
  getProductsForCounts,
  selectedCategories.length,
  selectedSubCategories,
  visibleSubCategories]
  );

  const subSubCategoryOptions = useMemo(() => {
    if (!selectedSubCategories.length) return [];
    const base = getProductsForCounts({
      ignoreParamKey: SUB_SUB_CATEGORY_PARAM
    });
    return visibleSubSubCategories.
    map((o) => ({
      ...o,
      count: base.filter(
        (p) => getProductRefId(p.subSubCategoryId) === o.id
      ).length
    })).
    filter(
      (o) => o.count > 0 || selectedSubSubCategories.includes(o.id ?? "")
    );
  }, [
  getProductsForCounts,
  selectedSubCategories,
  selectedSubSubCategories,
  visibleSubSubCategories]
  );

  const sidebarSpecificationGroups = useMemo(
    () =>
    scopedFilters.specifications.
    map((group) => {
      const base = getProductsForCounts({ ignoreParamKey: group.key });
      return {
        key: group.key,
        label: group.label,
        values: group.values.
        map((o) => ({
          ...o,
          count: base.filter((p) =>
          p.specifications.some(
            (spec) =>
            spec.key.trim().toLowerCase() === group.key &&
            spec.value === (o.value ?? o.label)
          )
          ).length
        })).
        filter(
          (o) =>
          o.count > 0 ||
          o.value &&
          (selectedSpecificationFilters[group.key] ?? []).includes(
            o.value
          )
        )
      };
    }).
    filter((g) => g.values.length > 0),
    [
    getProductsForCounts,
    scopedFilters.specifications,
    selectedSpecificationFilters]

  );

  const activeTitle = useMemo(() => {
    if (selectedSubSubCategories.length)
    return `${selectedSubSubCategories.length} sub-sub-category selections`;
    if (selectedSubCategories.length)
    return `${selectedSubCategories.length} sub-category selections`;
    if (selectedCategories.length)
    return `${selectedCategories.length} category selections`;
    if (selectedFilters.query)
    return `Search results for "${selectedFilters.query}"`;
    if (isSpecialCatalog) return "Your special catalog";
    return "All Products";
  }, [
  isSpecialCatalog,
  selectedCategories,
  selectedFilters.query,
  selectedSubCategories,
  selectedSubSubCategories]
  );

  const hasActiveFilters =
  selectedCategories.length > 0 ||
  selectedSubCategories.length > 0 ||
  selectedSubSubCategories.length > 0 ||
  Object.keys(selectedSpecificationFilters).length > 0 ||
  selectedFilters.query.length > 0;

  const activeFilterCount =
  selectedCategories.length +
  selectedSubCategories.length +
  selectedSubSubCategories.length +
  Object.keys(selectedSpecificationFilters).length + (
  selectedFilters.query ? 1 : 0);

  const toggleFilter = (paramKey, value) => {
    setSelectedFilters((current) => {
      const toggleValues = (values) =>
      values.includes(value) ?
      values.filter((item) => item !== value) :
      [...values, value];

      let nextFilters = current;

      if (paramKey === CATEGORY_PARAM) {
        const nextCategories = toggleValues(current.categories);
        const allowedSubs = filters.subCategories.
        filter((s) => s.parentId && nextCategories.includes(s.parentId)).
        map((s) => s.id).
        filter(Boolean);
        const nextSubCategories = current.subCategories.filter((item) =>
        allowedSubs.includes(item)
        );
        const allowedSubSubs = filters.subSubCategories.
        filter((s) => s.parentId && nextSubCategories.includes(s.parentId)).
        map((s) => s.id).
        filter(Boolean);

        nextFilters = {
          ...current,
          categories: nextCategories,
          subCategories: nextSubCategories,
          subSubCategories: current.subSubCategories.filter((item) =>
          allowedSubSubs.includes(item)
          )
        };
      } else if (paramKey === SUB_CATEGORY_PARAM) {
        const nextSubCategories = toggleValues(current.subCategories);
        const allowedSubSubs = filters.subSubCategories.
        filter((s) => s.parentId && nextSubCategories.includes(s.parentId)).
        map((s) => s.id).
        filter(Boolean);

        nextFilters = {
          ...current,
          subCategories: nextSubCategories,
          subSubCategories: current.subSubCategories.filter((item) =>
          allowedSubSubs.includes(item)
          )
        };
      } else if (paramKey === SUB_SUB_CATEGORY_PARAM) {
        nextFilters = {
          ...current,
          subSubCategories: toggleValues(current.subSubCategories)
        };
      } else {
        const currentSpecValues = current.specifications[paramKey] ?? [];
        const nextSpecValues = toggleValues(currentSpecValues);
        const nextSpecifications = { ...current.specifications };

        if (nextSpecValues.length)
        nextSpecifications[paramKey] = nextSpecValues;else
        delete nextSpecifications[paramKey];

        nextFilters = {
          ...current,
          specifications: nextSpecifications
        };
      }

      syncUrlWithFilters(nextFilters);
      return nextFilters;
    });
    setIsSidebarOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedFilters(EMPTY_SELECTED_FILTERS);
    syncUrlWithFilters(EMPTY_SELECTED_FILTERS);
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
    toggleFilter
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Special session banner */}
      {isSpecialCatalog && isSpecialSession &&
      <div
        className="px-6 py-2.5 text-center text-xs font-medium uppercase tracking-widest"
        style={{ background: "#1a1a1a", color: "rgba(255,255,255,0.7)" }}>
        
          Special catalog active —{" "}
          <span className="text-white">
            {specialUser?.allowedCategories.length} categories
          </span>{" "}
          available
        </div>
      }

      <main className="flex-1 pb-16 pt-6 mt-8">
        <section className="px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Mobile filter toggle */}
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#888" }}>
                
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
                  color: "#1a1a1a"
                }}>
                
                <SlidersHorizontal size={13} />
                Filters
                {hasActiveFilters &&
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
                  style={{ background: "#d94f4f" }}>
                  
                    {activeFilterCount}
                  </span>
                }
              </button>
            </div>

            {/* Mobile sidebar drawer */}
            {isSidebarOpen &&
            <div className="fixed inset-0 z-50 lg:hidden">
                <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)} />
              
                <aside className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">
                  <div className="flex justify-center pb-1 pt-3">
                    <div className="h-1 w-10 rounded-full bg-gray-200" />
                  </div>
                  <div className="px-6 pb-10">
                    <div
                    className="flex items-center justify-between border-b py-4"
                    style={{ borderColor: "#f0e0dc" }}>
                    
                      <div>
                        <p
                        className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                        style={{ color: "#d94f4f" }}>
                        
                          Catalog Filters
                        </p>
                        <h2
                        className="mt-1 text-2xl italic"
                        style={{
                          fontFamily: "'Georgia', serif",
                          color: "#1a1a1a"
                        }}>
                        
                          Refine selection
                        </h2>
                      </div>
                      <button
                      type="button"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ background: "#f5f5f5", color: "#555" }}>
                      
                        <X size={14} />
                      </button>
                    </div>
                    <SidebarContent
                    {...sharedSidebarProps}
                    onClearFilters={handleClearFilters} />
                  
                  </div>
                </aside>
              </div>
            }

            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              {/* Desktop sidebar */}
              <aside
                className="hidden h-fit rounded-2xl p-6 lg:sticky lg:top-28 lg:block"
                style={{ background: "#fdf5f3", border: "1px solid #f0e0dc" }}>
                
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: "#d94f4f" }}>
                  
                  Catalog Filters
                </p>
                <h2
                  className="mt-2 text-2xl italic"
                  style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a" }}>
                  
                  Refine selection
                </h2>
                <p className="mt-3 text-xs leading-5" style={{ color: "#888" }}>
                  Select a category first. Sub-categories appear after parent
                  selections are made.
                </p>
                <SidebarContent {...sharedSidebarProps} />
              </aside>

              {/* Main content */}
              <ProductResults
                activeTitle={activeTitle}
                filteredProducts={filteredProducts}
                hasActiveFilters={hasActiveFilters}
                isLoading={isLoading}
                loadError={loadError}
                onClearFilters={handleClearFilters}
                scopedProducts={scopedProducts} />
              
            </div>
          </div>
        </section>
      </main>
    </div>);

}

export default function ProductPage() {
  return (
    <Suspense>
      <ProductsPageDetails mode="default" />
    </Suspense>);

}
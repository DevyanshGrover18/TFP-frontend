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

type ProductRef = string | { _id: string; name: string };

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
  value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const getSelectedValues = (searchParams: URLSearchParams, key: string) =>
  Array.from(new Set(searchParams.getAll(key).filter(Boolean)));

const getProductRefId = (value: ProductRef | undefined) =>
  typeof value === "string" ? value : value?._id;

const matchesMultiValueFilter = (
  selectedValues: string[],
  candidate: string | undefined,
) => {
  if (!selectedValues.length) {
    return true;
  }

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
  if (!options.length) {
    return null;
  }

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
              <span className={`${isActive ? "text-white/70" : "text-stone-400"}`}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const ProductsPageDetails = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

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

        if (selectedValues.length) {
          acc[group.key] = selectedValues;
        }

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

        setProducts(productsResponse.products || []);
        setFilters(filtersResponse.filters ?? EMPTY_FILTERS);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load products.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const visibleSubCategories = useMemo(() => {
    if (!selectedCategories.length) {
      return [];
    }

    return filters.subCategories.filter(
      (subCategory) =>
        subCategory.parentId && selectedCategories.includes(subCategory.parentId),
    );
  }, [filters.subCategories, selectedCategories]);

  const visibleSubSubCategories = useMemo(() => {
    if (!selectedSubCategories.length) {
      return [];
    }

    return filters.subSubCategories.filter(
      (subSubCategory) =>
        subSubCategory.parentId &&
        selectedSubCategories.includes(subSubCategory.parentId),
    );
  }, [filters.subSubCategories, selectedSubCategories]);

  const matchesSpecificationFilters = (
    product: ProductRecord,
    specificationFilters: Record<string, string[]>,
  ) => {
    for (const [key, selectedValues] of Object.entries(specificationFilters)) {
      if (!selectedValues.length) {
        continue;
      }

      const hasMatch = product.specifications.some(
        (specification) =>
          specification.key.trim().toLowerCase() === key &&
          selectedValues.includes(specification.value),
      );

      if (!hasMatch) {
        return false;
      }
    }

    return true;
  };

  const getProductsForCounts = useCallback(
    ({ ignoreParamKey }: { ignoreParamKey?: string }) =>
      products.filter((product) => {
        const categoryId = getProductRefId(product.categoryId as ProductRef);
        const subCategoryId = getProductRefId(product.subCategoryId as ProductRef);
        const subSubCategoryId = getProductRefId(product.subSubCategoryId as ProductRef);

        if (
          ignoreParamKey !== CATEGORY_PARAM &&
          !matchesMultiValueFilter(selectedCategories, categoryId)
        ) {
          return false;
        }

        if (
          ignoreParamKey !== SUB_CATEGORY_PARAM &&
          !matchesMultiValueFilter(selectedSubCategories, subCategoryId)
        ) {
          return false;
        }

        if (
          ignoreParamKey !== SUB_SUB_CATEGORY_PARAM &&
          !matchesMultiValueFilter(selectedSubSubCategories, subSubCategoryId)
        ) {
          return false;
        }

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
      products,
      selectedCategories,
      selectedSubCategories,
      selectedSubSubCategories,
      selectedSpecificationFilters,
    ],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryId = getProductRefId(product.categoryId as ProductRef);
        const subCategoryId = getProductRefId(product.subCategoryId as ProductRef);
        const subSubCategoryId = getProductRefId(product.subSubCategoryId as ProductRef);

        if (!matchesMultiValueFilter(selectedCategories, categoryId)) {
          return false;
        }

        if (!matchesMultiValueFilter(selectedSubCategories, subCategoryId)) {
          return false;
        }

        if (!matchesMultiValueFilter(selectedSubSubCategories, subSubCategoryId)) {
          return false;
        }

        return matchesSpecificationFilters(product, selectedSpecificationFilters);
      }),
    [
      products,
      selectedCategories,
      selectedSubCategories,
      selectedSubSubCategories,
      selectedSpecificationFilters,
    ],
  );

  const categoryOptions = useMemo(() => {
    const baseProducts = getProductsForCounts({ ignoreParamKey: CATEGORY_PARAM });

    return filters.categories
      .map((option) => ({
        ...option,
        count: baseProducts.filter(
          (product) => getProductRefId(product.categoryId as ProductRef) === option.id,
        ).length,
      }))
      .filter((option) => option.count > 0 || selectedCategories.includes(option.id ?? ""));
  }, [
    filters.categories,
    selectedCategories,
    getProductsForCounts,
  ]);

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategories.length) {
      return [];
    }

    const baseProducts = getProductsForCounts({ ignoreParamKey: SUB_CATEGORY_PARAM });

    return visibleSubCategories
      .map((option) => ({
        ...option,
        count: baseProducts.filter(
          (product) => getProductRefId(product.subCategoryId as ProductRef) === option.id,
        ).length,
      }))
      .filter(
        (option) => option.count > 0 || selectedSubCategories.includes(option.id ?? ""),
      );
  }, [
    visibleSubCategories,
    selectedCategories.length,
    selectedSubCategories,
    getProductsForCounts,
  ]);

  const subSubCategoryOptions = useMemo(() => {
    if (!selectedSubCategories.length) {
      return [];
    }

    const baseProducts = getProductsForCounts({ ignoreParamKey: SUB_SUB_CATEGORY_PARAM });

    return visibleSubSubCategories
      .map((option) => ({
        ...option,
        count: baseProducts.filter(
          (product) =>
            getProductRefId(product.subSubCategoryId as ProductRef) === option.id,
        ).length,
      }))
      .filter(
        (option) =>
          option.count > 0 || selectedSubSubCategories.includes(option.id ?? ""),
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
          const baseProducts = getProductsForCounts({ ignoreParamKey: group.key });

          return {
            key: group.key,
            label: group.label,
            values: group.values
              .map((option) => {
                const optionValue = option.value ?? option.label;

                return {
                  ...option,
                  count: baseProducts.filter((product) =>
                    product.specifications.some(
                      (specification) =>
                        specification.key.trim().toLowerCase() === group.key &&
                        specification.value === optionValue,
                    ),
                  ).length,
                };
              })
              .filter(
                (option) =>
                  option.count > 0 ||
                  (option.value &&
                    (selectedSpecificationFilters[group.key] ?? []).includes(option.value)),
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
    if (selectedSubSubCategories.length) {
      return `${selectedSubSubCategories.length} sub-sub-category selections`;
    }

    if (selectedSubCategories.length) {
      return `${selectedSubCategories.length} sub-category selections`;
    }

    if (selectedCategories.length) {
      return `${selectedCategories.length} category selections`;
    }

    return "All products";
  }, [selectedCategories, selectedSubCategories, selectedSubSubCategories]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSubCategories.length > 0 ||
    selectedSubSubCategories.length > 0 ||
    Object.keys(selectedSpecificationFilters).length > 0;

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
        .filter(
          (subCategory) =>
            subCategory.parentId && nextValues.includes(subCategory.parentId),
        )
        .map((subCategory) => subCategory.id)
        .filter(Boolean) as string[];

      const nextSubCategories = getSelectedValues(params, SUB_CATEGORY_PARAM).filter(
        (item) => allowedSubCategories.includes(item),
      );

      params.delete(SUB_CATEGORY_PARAM);
      nextSubCategories.forEach((item) => params.append(SUB_CATEGORY_PARAM, item));

      const allowedSubSubCategories = filters.subSubCategories
        .filter(
          (subSubCategory) =>
            subSubCategory.parentId &&
            nextSubCategories.includes(subSubCategory.parentId),
        )
        .map((subSubCategory) => subSubCategory.id)
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
        .filter(
          (subSubCategory) =>
            subSubCategory.parentId && nextValues.includes(subSubCategory.parentId),
        )
        .map((subSubCategory) => subSubCategory.id)
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

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f2ea] text-stone-900">
      <main className="flex-1 pb-16 pt-4">
        <section className="mt-8 px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                    Catalog Filters
                  </p>
                  <h2
                    className="mt-3 text-3xl italic text-stone-900"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                  >
                    Refined selection
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-stone-600">
                    Select one or more categories first. Sub-categories and sub-sub-categories
                    only appear after their parent selections are made.
                  </p>
                </div>

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
              </aside>

              <div>
                <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Live Inventory
                    </p>
                    <h2
                      className="mt-2 text-3xl italic text-stone-900"
                      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                    >
                      {activeTitle}
                    </h2>
                  </div>
                  <p className="text-sm text-stone-600">
                    Showing{" "}
                    <span className="font-semibold text-stone-900">
                      {filteredProducts.length}
                    </span>
                    {products.length !== filteredProducts.length && (
                      <span className="text-stone-400"> of {products.length}</span>
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
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        name={product.name}
                        image={getProductPrimaryImage(product)}
                        href={getProductHref(product)}
                        details={{
                          sku: product.sku,
                          composition: getProductSpecification(product, "composition"),
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
                      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
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

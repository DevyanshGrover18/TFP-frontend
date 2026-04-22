import { fetchApi } from "./api";

export type ProductPayload = {
  sku: string;
  name: string;
  colorCode: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  description: string;
  specifications: Array<{
    key: string;
    value: string;
  }>;
  media: {
    mainImage: string;
    gallery: string[];
  };
  variants: Array<{
    id : string,
    sku : string,
    name: string;
    color: string;
    colorCode: string;
    mainImage: string;
    gallery: string[];
  }>;
};

export type ProductRecord = {
  _id: string;
  productId: string;
  sku: string;
  color: string;
  name: string;
  image : string;
  colorCode: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  description: string;
  specifications: Array<{
    key: string;
    value: string;
  }>;
  media: {
    mainImage: string;
    gallery: string[];
  };
  variants: Array<{
    id: string,
    sku : string,
    name: string;
    color: string;
    colorCode: string;
    mainImage: string;
    gallery: string[];
  }>;
    isNew?: boolean; 
};

export type ProductFilterOption = {
  id?: string;
  value?: string;
  label: string;
  count: number;
  parentId?: string;
};

export type ProductFilterGroup = {
  key: string;
  label: string;
  values: ProductFilterOption[];
};

export type ProductFiltersResponse = {
  success: boolean;
  message?: string;
  filters?: {
    categories: ProductFilterOption[];
    subCategories: ProductFilterOption[];
    subSubCategories: ProductFilterOption[];
    specifications: ProductFilterGroup[];
  };
};

export function createProductSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductPrimaryImage(product: ProductRecord) {
  return (
    product.media?.mainImage ||
    product.variants?.[0]?.mainImage ||
    product.media?.gallery?.[0] ||
    product.variants?.[0]?.gallery?.[0] ||
    ""
  );
}

export function getProductSpecification(product: ProductRecord, key: string) {
  const match = product.specifications.find(
    (item) => item.key.trim().toLowerCase() === key.trim().toLowerCase(),
  );

  return match?.value ?? "";
}

export function getProductDisplayColor(product: ProductRecord) {
  return product.variants?.[0]?.color || product.colorCode;
}

export function getProductHref(product: ProductRecord) {
  return `/products/${createProductSlug(product.name)}`;
}

export const getAllProducts = async () => {
  return fetchApi<{ products?: ProductRecord[] }>("/products", {
    cache: "no-store",
  });
};

export const getProductFilters = async () => {
  return fetchApi<ProductFiltersResponse>("/products/filters", {
    cache: "no-store",
  });
};

export const createProduct = async (payload: ProductPayload) => {
  return fetchApi<{ product?: ProductRecord }>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateProduct = async (id: string, payload: ProductPayload) => {
  return fetchApi<{ product?: ProductRecord }>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteProduct = async (id: string) => {
  return fetchApi<{ message?: string }>(`/products/${id}`, {
    method: "DELETE",
  });
};

export const getProductByName = async (name: string) => {
  return fetchApi<{
    success: boolean;
    message: string;
    product?: ProductRecord;
  }>(`/products/${name}`, {
    method: "GET",
  });
};

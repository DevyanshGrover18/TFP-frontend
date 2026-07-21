import { fetchApi } from "./api";































































































export function createProductSlug(name) {
  return name.
  trim().
  toLowerCase().
  replace(/[^a-z0-9]+/g, "-").
  replace(/^-+|-+$/g, "");
}

export function getProductPrimaryImage(product) {
  return (
    product.media?.mainImage ||
    product.variants?.[0]?.mainImage ||
    product.media?.gallery?.[0] ||
    product.variants?.[0]?.gallery?.[0] ||
    "");

}

export function getProductSpecification(product, key) {
  const match = product.specifications.find(
    (item) => item.key.trim().toLowerCase() === key.trim().toLowerCase()
  );

  return match?.value ?? "";
}

export function getProductDisplayColor(product) {
  return product.variants?.[0]?.color || product.colorCode;
}

export function getProductHref(product) {
  return `/product?slug=${encodeURIComponent(createProductSlug(product.name))}`;
}

export const getAllProducts = async () => {
  return fetchApi("/products", {
    cache: "no-store",
    onUnauthorizedRedirectTo: null
  });
};

export const getProductFilters = async () => {
  return fetchApi("/products/filters", {
    cache: "no-store",
    onUnauthorizedRedirectTo: null
  });
};

export const createProduct = async (payload) => {
  return fetchApi("/products", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateProduct = async (id, payload) => {
  return fetchApi(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
};

export const deleteProduct = async (id) => {
  return fetchApi(`/products/${id}`, {
    method: "DELETE"
  });
};

export const getProductByName = async (name) => {
  return fetchApi(



    `/products/${name}`, {
      method: "GET",
      onUnauthorizedRedirectTo: null
    });
};
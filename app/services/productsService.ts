import { fetchApi } from "./api";

type ProductPayload = {
  sku: string;
  name: string;
  image: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  composition: string;
  color: string;
  width: string;
  weight: string;
};

export const getAllProducts = async () => {
  return fetchApi<{ products?: unknown[] }>("/products", {
    cache: "no-store",
  });
};

export const createProduct = async (payload: ProductPayload) => {
  return fetchApi<{ product?: unknown }>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateProduct = async (id: string, payload: ProductPayload) => {
  return fetchApi<{ product?: unknown }>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteProduct = async (id: string) => {
  return fetchApi<{ message?: string }>(`/products/${id}`, {
    method: "DELETE",
  });
};

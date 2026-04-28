import { fetchApi } from "./api";

export type Category = {
  _id: string;
  name: string;
  image?: string;
  parentId?: string;
  level: number;
  productCount?: number;
  children?: Category[];
};

export type CategoryPayload = {
  name: string;
  image: string;
  parentId?: string | null;
};

export const getAllCategories = async () => {
  return fetchApi<{ categories?: Category[] }>("/categories/tree", {
    cache: "no-store",
  });
};

export const createCategory = async (payload: CategoryPayload) => {
  return fetchApi<{ category?: Category }>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateCategory = async (id: string, payload: CategoryPayload) => {
  return fetchApi<{ category?: Category }>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteCategory = async (id: string) => {
  return fetchApi<{ message?: string }>(`/categories/${id}`, {
    method: "DELETE",
  });
};

export const getCategoryById = async (id: string) => {
  return fetchApi<Category>(`/categories/${id}`, {
    method: "GET",
  });
};

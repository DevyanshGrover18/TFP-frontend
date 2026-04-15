import { fetchApi } from "./api";

type CategoryPayload = {
  name: string;
  image: string;
  parentId: string | null;
};

export const getAllCategories = async () => {
  return fetchApi<{ categories?: unknown[] }>("/categories/tree", {
    cache: "no-store",
  });
};

export const createCategory = async (payload: CategoryPayload) => {
  return fetchApi<{ category?: unknown }>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateCategory = async (id: string, payload: CategoryPayload) => {
  return fetchApi<{ category?: unknown }>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteCategory = async (id: string) => {
  return fetchApi<{ message?: string }>(`/categories/${id}`, {
    method: "DELETE",
  });
};

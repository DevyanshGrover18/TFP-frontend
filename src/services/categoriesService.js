import { fetchApi } from "./api";

















export const getAllCategories = async () => {
  return fetchApi("/categories/tree", {
    cache: "no-store",
    onUnauthorizedRedirectTo: null
  });
};

export const createCategory = async (payload) => {
  return fetchApi("/categories", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateCategory = async (id, payload) => {
  return fetchApi(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
};

export const deleteCategory = async (id) => {
  return fetchApi(`/categories/${id}`, {
    method: "DELETE"
  });
};

export const getCategoryById = async (id) => {
  return fetchApi(`/categories/${id}`, {
    method: "GET"
  });
};
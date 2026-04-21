import { fetchApi } from "./api";

type Category = {
  _id : string,
  name : string
  parentId? : string,
  level : number,

}

export const getAllCategories = async () => {
  return fetchApi<{ categories?: unknown[] }>("/categories/tree", {
    cache: "no-store",
  });
};

export const createCategory = async (payload: Category) => {
  return fetchApi<{ category?: unknown }>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateCategory = async (id: string, payload: Category) => {
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

export const getCategoryById = async (id : string)=>{
  return fetchApi<Category>(`/categories/${id}`, {
    method : "GET"
  })
}
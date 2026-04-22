import { fetchApi } from "./api";

export type SpecialUserRecord = {
  id: string;
  name: string;
  email: string;
  status: boolean;
  allowedCategories: string[];
};

export type CreateSpecialUserPayload = {
  name: string;
  email: string;
  password: string;
  status: boolean;
  allowedCategories: string[];
};

export type UpdateSpecialUserPayload = Partial<CreateSpecialUserPayload>;

type SpecialUsersResponse = {
  message?: string;
  users?: SpecialUserRecord[];
};

type SpecialUserResponse = {
  success: boolean;
  message?: string;
  user?: SpecialUserRecord;
};

export const getAllSpecialUsers = async () => {
  return fetchApi<SpecialUsersResponse>("/special-users/all", {
    cache: "no-store",
  });
};

export const createSpecialUser = async (payload: CreateSpecialUserPayload) => {
  return fetchApi<SpecialUserResponse>("/special-users/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateSpecialUser = async (
  id: string,
  data: UpdateSpecialUserPayload,
) => {
  return fetchApi<SpecialUserResponse>(`/special-users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ data }),
  });
};

export const deleteSpecialUser = async (id: string) => {
  return fetchApi<{ message?: string }>(`/special-users/${id}`, {
    method: "DELETE",
  });
};

// Login — used by AuthContext, not called directly in components
export const loginSpecialUserApi = async (email: string, password: string) => {
  return fetchApi<SpecialUserResponse>("/special-users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    onUnauthorizedRedirectTo: null,
  });
};
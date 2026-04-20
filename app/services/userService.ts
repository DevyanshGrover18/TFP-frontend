import { fetchApi } from "./api";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  status?: boolean;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  status: boolean;
};

export type UpdateUserPayload = {
  name: string;
  email: string;
  password?: string;
  status: boolean;
};

export const getAllUsers = async () => {
  return fetchApi<{ users?: UserRecord[]; message?: string }>("/user", {
    cache: "no-store",
  });
};

export const createUser = async (payload: CreateUserPayload) => {
  return fetchApi<{ user?: UserRecord; message?: string }>("/user", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  return fetchApi<{ user?: UserRecord; message?: string }>(`/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteUser = async (id: string) => {
  return fetchApi<{ message?: string }>(`/user/${id}`, {
    method: "DELETE",
  });
};

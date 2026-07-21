import { fetchApi } from "./api";






























export const getAllSpecialUsers = async () => {
  return fetchApi("/special-users/all", {
    cache: "no-store"
  });
};

export const createSpecialUser = async (payload) => {
  return fetchApi("/special-users/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateSpecialUser = async (
id,
data) =>
{
  return fetchApi(`/special-users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ data })
  });
};

export const deleteSpecialUser = async (id) => {
  return fetchApi(`/special-users/${id}`, {
    method: "DELETE"
  });
};

// Login — used by AuthContext, not called directly in components
export const loginSpecialUserApi = async (email, password) => {
  return fetchApi("/special-users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    onUnauthorizedRedirectTo: null
  });
};

export const createSpecialUserRequest = async (name, companyName, email) => {
  return fetchApi("/special-users/request", {
    method: "POST",
    body: JSON.stringify({ name, companyName, email })
  });
};

export const getSpecialUserById = async (id) => {
  return fetchApi(`/special-users/${id}`, {
    cache: "no-store"
  });
};











export const getAllSpecialUserRequests = async () => {
  return fetchApi("/special-users/request", {
    cache: "no-store"
  });
};

export const updateSpecialUserRequestStatus = async (id, status) => {
  return fetchApi(`/special-users/request/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
};

export const deleteSpecialUserRequest = async (id) => {
  return fetchApi(`/special-users/request/${id}`, {
    method: "DELETE"
  });
};
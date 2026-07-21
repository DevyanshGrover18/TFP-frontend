import { fetchApi } from "./api";








































































export const getAllUsers = async () => {
  return fetchApi("/user", {
    cache: "no-store"
  });
};

export const createUser = async (payload) => {
  return fetchApi("/user", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateUser = async (id, payload) => {
  return fetchApi(`/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
};

export const deleteUser = async (id) => {
  return fetchApi(`/user/${id}`, {
    method: "DELETE"
  });
};

export const getCurrentUserProfile = async () => {
  return fetchApi("/user/profile", {
    cache: "no-store",
    onUnauthorizedRedirectTo: "/login"
  });
};

export const updateCurrentUserProfile = async (payload) => {
  return fetchApi(
    "/user/profile",
    {
      method: "PUT",
      body: JSON.stringify(payload),
      onUnauthorizedRedirectTo: "/login"
    }
  );
};
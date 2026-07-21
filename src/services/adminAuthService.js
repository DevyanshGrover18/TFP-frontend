import { fetchApi } from "./api";






export const loginAdmin = async (username, password) => {
  const response = fetchApi(`/auth/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
  return response;
};

export const logoutAdmin = async () => {
  const response = fetchApi(`/auth/admin/logout`, {
    method: "GET"
  });
  return response;
};
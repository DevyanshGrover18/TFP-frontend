import { fetchApi } from "./api";













export const signupUser = async (
name,
email,
password) =>

fetchApi("/user/auth/signup", {
  method: "POST",
  body: JSON.stringify({ name, email, password }),
  onUnauthorizedRedirectTo: null
});

export const loginUser = async (email, password) =>
fetchApi("/user/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
  onUnauthorizedRedirectTo: null
});

export const logoutUser = async () =>
fetchApi("/user/auth/logout", {
  method: "GET",
  onUnauthorizedRedirectTo: null
});
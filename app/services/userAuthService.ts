import { fetchApi } from "./api";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type UserAuthResponse = {
  success: boolean;
  message?: string;
  user?: AuthUser;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
) =>
  fetchApi<UserAuthResponse>("/auth/user/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    onUnauthorizedRedirectTo: null,
  });

export const loginUser = async (email: string, password: string) =>
  fetchApi<UserAuthResponse>("/auth/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    onUnauthorizedRedirectTo: null,
  });

export const logoutUser = async () =>
  fetchApi<UserAuthResponse>("/auth/user/logout", {
    method: "GET",
    onUnauthorizedRedirectTo: null,
  });

import { buildLoginRedirectFromWindow } from "./authRedirect";

const BASE_URL =
import.meta.env.VITE_API_BASE_URL ?? (
import.meta.env.MODE === "production" ?
"https://tfp-backend.onrender.com" :
"http://localhost:8000");
const API_URL = `${BASE_URL}/api`;






export const fetchApi = async (
url,
options = {}) =>
{
  const { onUnauthorizedRedirectTo = "/admin/login", ...requestOptions } = options;

  const response = await fetch(`${API_URL}${url}`, {
    credentials: "include",
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(requestOptions.headers ?? {})
    }
  });

  const data = await response.json().catch(() => ({}));



  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-unauthorized"));
      if (onUnauthorizedRedirectTo) {
        window.location.href =
        onUnauthorizedRedirectTo === "/login" ?
        buildLoginRedirectFromWindow() :
        onUnauthorizedRedirectTo;
      }
    }
    throw new Error(data.message ?? "Unauthorized");
  }

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
};
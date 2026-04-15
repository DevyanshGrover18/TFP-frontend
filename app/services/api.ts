const BASE_URL = "http://localhost:8000";
// const BASE_URL = "https://tfp-backend.onrender.com";
const API_URL = `${BASE_URL}/api`;

type FetchApiOptions = RequestInit & {
  headers?: HeadersInit;
};

export const fetchApi = async <T>(
  url: string,
  options: FetchApiOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error(data.message ?? "Unauthorized");
  }

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
};

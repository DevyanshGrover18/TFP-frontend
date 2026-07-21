import { fetchApi } from "./api";
























export const createEnquiry = async (payload) => {
  return fetchApi("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
    onUnauthorizedRedirectTo: null
  });
};

export const getAllEnquiries = async () => {
  return fetchApi(



    "/contact", {
      cache: "no-store"
    });
};

export const deleteEnquiry = async (id) => {
  return fetchApi(`/contact/${id}`, {
    method: "DELETE"
  });
};
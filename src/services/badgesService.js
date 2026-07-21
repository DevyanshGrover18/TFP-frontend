import { fetchApi } from "./api";






export const getAllBadges = async () => {
  return fetchApi("/badges", {
    cache: "no-store"
  });
};

export const createBadge = async (name) => {
  return fetchApi("/badges", {
    method: "POST",
    body: JSON.stringify({ name })
  });
};

export const deleteBadge = async (id) => {
  return fetchApi(`/badges/${id}`, {
    method: "DELETE"
  });
};
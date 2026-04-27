import { fetchApi } from "./api";

export type BadgeRecord = {
  id: string;
  name: string;
};

export const getAllBadges = async () => {
  return fetchApi<{ badges?: BadgeRecord[]; message?: string }>("/badges", {
    cache: "no-store",
  });
};

export const createBadge = async (name: string) => {
  return fetchApi<{ badge?: BadgeRecord; message?: string }>("/badges", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const deleteBadge = async (id: string) => {
  return fetchApi<{ message?: string }>(`/badges/${id}`, {
    method: "DELETE",
  });
};

import { fetchApi } from "./api";

export const addImages = async (images) => {
  return await fetchApi("/home", {
    method: "POST",
    body: JSON.stringify({ images })
  });
};


export const deleteImageById = async (id) => {
  return await fetchApi(`/home/${id}`, {
    method: "DELETE"
  });

};

export const getAllImages = async () => {
  return await fetchApi('/home', {
    method: "GET",
    onUnauthorizedRedirectTo: null
  });
};
import { fetchApi } from "./api";

export const addImages = async (images: string[]) => {
  return await fetchApi<{ success: boolean; message: string }>("/home", {
    method: "POST",
    body: JSON.stringify({ images }),
  });
};


export const deleteImageById = async (id: string) => {
    return await fetchApi<{ success: boolean; message: string }>(`/home/${id}`, {
      method: "DELETE",
    });

}

export const getAllImages = async () =>{
    return await fetchApi<{success : boolean, message? : string, images?: any}>('/home', {
        method : "GET"
    })
}
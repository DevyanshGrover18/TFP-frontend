import { fetchApi } from "./api";

type AdminAuthResponse = {
  success: boolean;
  message?: string;
};

export const loginAdmin = async(username : string, password : string) => {
    const response =  fetchApi<AdminAuthResponse>(`/auth/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    return response
}

export const logoutAdmin = async()=>{
    const response =  fetchApi<AdminAuthResponse>(`/auth/admin/logout`, {
        method : "GET"
    })
    return response
}

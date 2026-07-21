import { fetchApi } from "./api";




























export const getCartItems = async () =>
fetchApi("/cart/me", {
  cache: "no-store",
  onUnauthorizedRedirectTo: null
});

export const addCartItem = async (payload) =>



fetchApi("/cart/add", {
  method: "POST",
  body: JSON.stringify(payload),
  onUnauthorizedRedirectTo: "/login"
});

export const removeCartItem = async (payload) =>



fetchApi("/cart/remove", {
  method: "DELETE",
  body: JSON.stringify(payload),
  onUnauthorizedRedirectTo: "/login"
});

export const clearCart = async (id) => {
  return fetchApi(`/cart/clear`, {
    method: "DELETE"
  });
};
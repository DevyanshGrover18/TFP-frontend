import { fetchApi } from "./api";

export type CartItemRecord = {
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  colorCode: string;
  description: string;
  image: string;
  variant: {
    sku: string;
    name: string;
    color: string;
    colorCode: string;
  } | null;
};

type CartResponse = {
  success: boolean;
  message?: string;
  items?: CartItemRecord[];
};

type CartMutationResponse = {
  success: boolean;
  message?: string;
};

export const getCartItems = async () =>
  fetchApi<CartResponse>("/cart/me", {
    cache: "no-store",
    onUnauthorizedRedirectTo: "/login",
  });

export const addCartItem = async (payload: {
  productId: string;
  variantId?: string | null;
}) =>
  fetchApi<CartMutationResponse>("/cart/add", {
    method: "POST",
    body: JSON.stringify(payload),
    onUnauthorizedRedirectTo: "/login",
  });

export const removeCartItem = async (payload: {
  productId: string;
  variantId?: string | null;
}) =>
  fetchApi<CartMutationResponse>("/cart/remove", {
    method: "DELETE",
    body: JSON.stringify(payload),
    onUnauthorizedRedirectTo: "/login",
  });

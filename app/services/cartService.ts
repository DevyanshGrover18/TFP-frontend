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

export const getCartItems = async (userId: string) =>
  fetchApi<CartResponse>(`/cart/${userId}`, {
    cache: "no-store",
    onUnauthorizedRedirectTo: null,
  });

export const addCartItem = async (payload: {
  userId: string;
  productId: string;
  variantId?: string | null;
}) =>
  fetchApi<CartMutationResponse>("/cart/add", {
    method: "POST",
    body: JSON.stringify(payload),
    onUnauthorizedRedirectTo: null,
  });

export const removeCartItem = async (payload: {
  userId: string;
  productId: string;
  variantId?: string | null;
}) =>
  fetchApi<CartMutationResponse>("/cart/remove", {
    method: "DELETE",
    body: JSON.stringify(payload),
    onUnauthorizedRedirectTo: null,
  });

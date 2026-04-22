import { fetchApi } from "./api";
import type { UserQuoteProfile } from "./userService";

export type OrderItemRecord = {
  productId: string;
  variantId: string | null;
  quantity: number;
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

export type OrderRecord = {
  id: string;
  orderNumber: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
  userId: string;
  customerName: string;
  companyName: string;
  email: string;
  mobile: string;
  itemCount: number;
  profile: UserQuoteProfile;
  items: OrderItemRecord[];
};

export const createOrder = async () => {
  return fetchApi<{ order?: OrderRecord; message?: string }>("/orders", {
    method: "POST",
    onUnauthorizedRedirectTo: "/login",
  });
};

export const getAllOrders = async () => {
  return fetchApi<{ orders?: OrderRecord[]; message?: string }>("/orders", {
    cache: "no-store",
  });
};

export const getMyOrders = async () => {
  return fetchApi<{ orders?: OrderRecord[]; message?: string }>("/orders/me", {
    cache: "no-store",
    onUnauthorizedRedirectTo: "/login",
  });
};

export const getOrderById = async (id: string) => {
  return fetchApi<{ order?: OrderRecord; message?: string }>(`/orders/${id}`, {
    cache: "no-store",
  });
};

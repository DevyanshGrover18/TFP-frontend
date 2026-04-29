import { fetchApi } from "./api";
import type { UserQuoteProfile } from "./userService";

export type OrderDateRange = {
  startDate: string;
  endDate: string;
};

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

export type OrderField = {
  key: string;
  value: string;
};

export type OrderRecord = {
  _id: string;
  id: string;
  orderNumber: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
  userId: string;
  userRole?: "user" | "special" | null;
  customerName: string;
  companyName: string;
  email: string;
  mobile: string;
  itemCount: number;
  profile: UserQuoteProfile;
  items: OrderItemRecord[];
  fields : OrderField[];
};

export const createOrder = async () => {
  return fetchApi<{ order?: OrderRecord; message?: string; success: boolean }>(
    "/orders",
    {
      method: "POST",
      onUnauthorizedRedirectTo: "/login",
    },
  );
};

function buildRangeQuery(range?: OrderDateRange) {
  if (!range) {
    return "";
  }

  return `?${new URLSearchParams({
    startDate: range.startDate,
    endDate: range.endDate,
  }).toString()}`;
}

export const getAllOrders = async (range?: OrderDateRange) => {
  return fetchApi<{ orders?: OrderRecord[]; message?: string }>(
    `/orders${buildRangeQuery(range)}`,
    {
      cache: "no-store",
    },
  );
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
    onUnauthorizedRedirectTo: "/login",
  });
};

export const sendOrderSuccessMail = async (
  orderId?: string,
) => {
  return fetchApi<{ success?: boolean; message?: string }>(
    "/orders/send-mail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
      credentials: "include",
      onUnauthorizedRedirectTo: "/login",
    },
  );
};

export const updateOrderStatus = async (
  id: string,
  status?: string,
  fields?: { key: string; value: string }[],
) => {
  return fetchApi<{ success?: string; message?: string }>(`/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, fields }),  // was: feilds (typo), and fields was missing
    credentials: "include",
  });
};

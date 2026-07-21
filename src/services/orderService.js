import { fetchApi } from "./api";















































export const createOrder = async () => {
  return fetchApi(
    "/orders",
    {
      method: "POST",
      onUnauthorizedRedirectTo: "/login"
    }
  );
};

function buildRangeQuery(range) {
  if (!range) {
    return "";
  }

  return `?${new URLSearchParams({
    startDate: range.startDate,
    endDate: range.endDate
  }).toString()}`;
}

export const getAllOrders = async (range) => {
  return fetchApi(
    `/orders${buildRangeQuery(range)}`,
    {
      cache: "no-store"
    }
  );
};

export const getMyOrders = async () => {
  return fetchApi("/orders/me", {
    cache: "no-store",
    onUnauthorizedRedirectTo: "/login"
  });
};

export const getOrderById = async (id) => {
  return fetchApi(`/orders/${id}`, {
    cache: "no-store",
    onUnauthorizedRedirectTo: "/login"
  });
};

export function getOrderHref(id) {
  return `/order?id=${encodeURIComponent(id)}`;
}

export const sendOrderSuccessMail = async (
orderId) =>
{
  return fetchApi(
    "/orders/send-mail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ orderId }),
      credentials: "include",
      onUnauthorizedRedirectTo: "/login"
    }
  );
};

export const updateOrderStatus = async (
id,
status,
fields) =>
{
  return fetchApi(
    `/orders/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status, fields }), // was: feilds (typo), and fields was missing
      credentials: "include"
    });
};
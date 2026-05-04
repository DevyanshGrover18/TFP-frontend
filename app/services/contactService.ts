import { fetchApi } from "./api";

export type EnquiryPayload = {
  existingCustomer: boolean;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

export type EnquiryRecord = {
  _id: string;
  existingCustomer: boolean;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export const createEnquiry = async (payload: EnquiryPayload) => {
  return fetchApi<{ success: boolean; message?: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
    onUnauthorizedRedirectTo: null,
  });
};

export const getAllEnquiries = async () => {
  return fetchApi<{
    success?: boolean;
    contacts?: EnquiryRecord[];
    message?: string;
  }>("/contact", {
    cache: "no-store",
  });
};

export const deleteEnquiry = async (id: string) => {
  return fetchApi<{ success?: boolean; message?: string }>(`/contact/${id}`, {
    method: "DELETE",
  });
};

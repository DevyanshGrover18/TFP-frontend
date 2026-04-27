import { fetchApi } from "./api";

export type QuoteCategoryValue = {
  id: string;
  name: string;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  status?: boolean;
};

export type QuoteInvoiceProfile = {
  companyName: string;
  street: string;
  nr: string;
  apartment: string;
  city: string;
  zip: string;
  country: string;
  notLiableForVat: boolean;
  vatNumber: string;
  chamberOfCommerce: string;
  category: QuoteCategoryValue;
  website: string;
};

export type QuoteShippingProfile = {
  sameAsInvoice: boolean;
  companyName: string;
  street: string;
  nr: string;
  apartment: string;
  city: string;
  zip: string;
  country: string;
};

export type QuoteDetailsProfile = {
  firstName: string;
  lastName: string;
  email: string;
  emailInvoice: string;
  mobileCode: string;
  mobile: string;
  phoneCode: string;
  phone: string;
  acceptUpdates: boolean;
  acceptTerms: boolean;
};

export type UserQuoteProfile = {
  invoice: QuoteInvoiceProfile;
  shipping: QuoteShippingProfile;
  details: QuoteDetailsProfile;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  status: boolean;
};

export type UpdateUserPayload = {
  name: string;
  email: string;
  password?: string;
  status: boolean;
};

export const getAllUsers = async () => {
  return fetchApi<{ users?: UserRecord[]; message?: string }>("/user", {
    cache: "no-store",
  });
};

export const createUser = async (payload: CreateUserPayload) => {
  return fetchApi<{ user?: UserRecord; message?: string }>("/user", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  return fetchApi<{ user?: UserRecord; message?: string }>(`/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteUser = async (id: string) => {
  return fetchApi<{ message?: string }>(`/user/${id}`, {
    method: "DELETE",
  });
};

export const getCurrentUserProfile = async () => {
  return fetchApi<{ profile?: UserQuoteProfile; message?: string }>("/user/profile", {
    cache: "no-store",
    onUnauthorizedRedirectTo: "/login",
  });
};

export const updateCurrentUserProfile = async (payload: UserQuoteProfile) => {
  return fetchApi<{ user?: UserRecord; profile?: UserQuoteProfile; message?: string }>(
    "/user/profile",
    {
      method: "PUT",
      body: JSON.stringify(payload),
      onUnauthorizedRedirectTo: "/login",
    },
  );
};

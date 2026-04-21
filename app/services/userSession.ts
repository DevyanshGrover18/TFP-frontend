"use client";

const USER_STORAGE_KEY = "tfp-user";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
};

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as StoredUser;
  } catch {
    return null;
  }
}

export function storeUser(user: StoredUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
}

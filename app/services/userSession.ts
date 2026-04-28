"use client";

const USER_STORAGE_KEY = "tfp-user";
const SPECIAL_USER_STORAGE_KEY = "tfp-special-user";

export type StoredSpecialUser = {
  id: string;
  name: string;
  email: string;
  isSpecial: true;
};

export function getStoredSpecialUser(): StoredSpecialUser | null {
  if (typeof window === "undefined") return null;
  try {
    const rawValue = window.localStorage.getItem(SPECIAL_USER_STORAGE_KEY);
    if (!rawValue) return null;
    return JSON.parse(rawValue) as StoredSpecialUser;
  } catch {
    return null;
  }
}

export function storeSpecialUser(user: StoredSpecialUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SPECIAL_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredSpecialUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SPECIAL_USER_STORAGE_KEY);
}

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

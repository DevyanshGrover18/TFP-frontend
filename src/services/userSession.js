"use client";

const USER_STORAGE_KEY = "tfp-user";
const SPECIAL_USER_STORAGE_KEY = "tfp-special-user";









export function getStoredSpecialUser() {
  if (typeof window === "undefined") return null;
  try {
    const rawValue = window.localStorage.getItem(SPECIAL_USER_STORAGE_KEY);
    if (!rawValue) return null;
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function storeSpecialUser(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SPECIAL_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredSpecialUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SPECIAL_USER_STORAGE_KEY);
}







export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function storeUser(user) {
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
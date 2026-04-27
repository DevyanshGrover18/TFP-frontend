"use client";

import type { UserQuoteProfile } from "./userService";

const SPECIAL_USER_PROFILE_STORAGE_KEY = "tfp-special-user-profiles";

type StoredSpecialProfiles = Record<string, UserQuoteProfile>;

function normalizeProfile(profile: UserQuoteProfile): UserQuoteProfile {
  const category = profile?.invoice?.category;

  return {
    ...profile,
    invoice: {
      ...profile.invoice,
      category:
        typeof category === "string"
          ? { id: "", name: category }
          : {
              id: category?.id ?? "",
              name: category?.name ?? "",
            },
    },
  };
}

function readProfiles(): StoredSpecialProfiles {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(
      SPECIAL_USER_PROFILE_STORAGE_KEY,
    );

    if (!rawValue) {
      return {};
    }

    return JSON.parse(rawValue) as StoredSpecialProfiles;
  } catch {
    return {};
  }
}

function writeProfiles(profiles: StoredSpecialProfiles) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SPECIAL_USER_PROFILE_STORAGE_KEY,
    JSON.stringify(profiles),
  );
}

export function getStoredSpecialUserProfile(specialUserId: string) {
  const profile = readProfiles()[specialUserId];
  return profile ? normalizeProfile(profile) : null;
}

export function storeSpecialUserProfile(
  specialUserId: string,
  profile: UserQuoteProfile,
) {
  const profiles = readProfiles();
  profiles[specialUserId] = normalizeProfile(profile);
  writeProfiles(profiles);
}

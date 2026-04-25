"use client";

import type { UserQuoteProfile } from "./userService";

const SPECIAL_USER_PROFILE_STORAGE_KEY = "tfp-special-user-profiles";

type StoredSpecialProfiles = Record<string, UserQuoteProfile>;

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
  return readProfiles()[specialUserId] ?? null;
}

export function storeSpecialUserProfile(
  specialUserId: string,
  profile: UserQuoteProfile,
) {
  const profiles = readProfiles();
  profiles[specialUserId] = profile;
  writeProfiles(profiles);
}

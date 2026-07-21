"use client";



const SPECIAL_USER_PROFILE_STORAGE_KEY = "tfp-special-user-profiles";



function normalizeProfile(profile) {
  const category = profile?.invoice?.category;

  return {
    ...profile,
    invoice: {
      ...profile.invoice,
      category:
      typeof category === "string" ?
      { id: "", name: category } :
      {
        id: category?.id ?? "",
        name: category?.name ?? ""
      }
    }
  };
}

function readProfiles() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(
      SPECIAL_USER_PROFILE_STORAGE_KEY
    );

    if (!rawValue) {
      return {};
    }

    return JSON.parse(rawValue);
  } catch {
    return {};
  }
}

function writeProfiles(profiles) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SPECIAL_USER_PROFILE_STORAGE_KEY,
    JSON.stringify(profiles)
  );
}

export function getStoredSpecialUserProfile(specialUserId) {
  const profile = readProfiles()[specialUserId];
  return profile ? normalizeProfile(profile) : null;
}

export function storeSpecialUserProfile(
specialUserId,
profile)
{
  const profiles = readProfiles();
  profiles[specialUserId] = normalizeProfile(profile);
  writeProfiles(profiles);
}
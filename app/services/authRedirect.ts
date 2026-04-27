export function buildLoginRedirectPath(pathname: string, search = "") {
  const currentPath = `${pathname}${search}`;
  const params = new URLSearchParams({
    redirect: currentPath || "/",
  });

  return `/login?${params.toString()}`;
}

export function buildLoginRedirectFromWindow() {
  if (typeof window === "undefined") {
    return "/login";
  }

  return buildLoginRedirectPath(
    window.location.pathname,
    window.location.search,
  );
}

export function getSafePostLoginRedirect(redirect: string | null) {
  if (!redirect) {
    return "/";
  }

  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/";
  }

  if (redirect.startsWith("/login")) {
    return "/";
  }

  return redirect;
}

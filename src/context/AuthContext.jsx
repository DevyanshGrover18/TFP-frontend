"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback } from

"react";
import { fetchApi } from "@/services/api";
import {
  clearStoredSpecialUser,
  getStoredSpecialUser,
  getStoredUser,
  clearStoredUser,
  storeSpecialUser,
  storeUser } from
"@/services/userSession";






























const AuthContext = createContext(null);

const SESSION_KEY = "tfp_session";

function readSession() {
  if (typeof window === "undefined") {
    return { sessionType: null, user: null, specialUser: null };
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return readStoredSession();
    return JSON.parse(raw);
  } catch {
    return readStoredSession();
  }
}

function readStoredSession() {
  const storedSpecialUser = getStoredSpecialUser();
  if (storedSpecialUser) {
    return {
      sessionType: "special",
      user: null,
      specialUser: {
        id: storedSpecialUser.id,
        name: storedSpecialUser.name,
        email: storedSpecialUser.email,
        allowedCategories: storedSpecialUser.allowedCategories ?? []
      }
    };
  }

  const storedUser = getStoredUser();
  if (storedUser) {
    return {
      sessionType: "user",
      user: storedUser,
      specialUser: null
    };
  }

  return { sessionType: null, user: null, specialUser: null };
}

function writeSession(state) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    sessionType: null,
    user: null,
    specialUser: null
  });

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    const saved = readSession();
    if (saved.sessionType) {
      setState(saved);
    }
  }, []);

  // Handle unauthorized event globally (e.g. from expired backend cookie)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUnauthorized = () => {
      clearStoredUser();
      clearStoredSpecialUser();
      clearSession();
      setState({ sessionType: null, user: null, specialUser: null });
    };
    window.addEventListener("auth-unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth-unauthorized", handleUnauthorized);
    };
  }, []);

  const loginAsSpecialUser = useCallback(
    async (email, password) => {
      // If a regular user session is active, log them out first
      if (state.sessionType === "user") {
        await fetchApi("/user/auth/logout", {
          method: "GET",
          onUnauthorizedRedirectTo: null
        }).catch(() => null); // don't block special login if this fails
      }

      const data = await fetchApi(



        "/special-users/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          onUnauthorizedRedirectTo: null
        });

      if (!data.success || !data.user) {
        throw new Error(data.message ?? "Login failed");
      }

      const next = {
        sessionType: "special",
        user: null,
        specialUser: data.user
      };

      clearStoredUser();
      clearStoredSpecialUser();
      storeSpecialUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isSpecial: true,
        allowedCategories: data.user.allowedCategories
      });
      setState(next);
      writeSession(next);
    },
    [state.sessionType]
  );

  const signupAsUser = useCallback(
    async (name, email, password) => {
      if (state.sessionType === "special") {
        await fetchApi("/special-users/logout", {
          method: "GET",
          onUnauthorizedRedirectTo: null
        }).catch(() => null);
      }

      const data = await fetchApi(



        "/user/auth/signup", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
          onUnauthorizedRedirectTo: null
        });

      if (!data.success || !data.user) {
        throw new Error(data.message ?? "Signup failed");
      }

      const next = {
        sessionType: "user",
        user: data.user,
        specialUser: null
      };

      clearStoredSpecialUser();
      storeUser(data.user);
      setState(next);
      writeSession(next);
    },
    [state.sessionType]
  );

  const loginAsUser = useCallback(async (email, password) => {
    // If a special session is active, clear it first
    if (state.sessionType === "special") {
      await fetchApi("/special-users/logout", {
        method: "GET",
        onUnauthorizedRedirectTo: null
      }).catch(() => null);
    }

    const data = await fetchApi(



      "/user/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        onUnauthorizedRedirectTo: null
      });

    if (!data.success || !data.user) {
      throw new Error(data.message ?? "Login failed");
    }

    const next = {
      sessionType: "user",
      user: data.user,
      specialUser: null
    };

    clearStoredSpecialUser();
    storeUser(data.user);
    setState(next);
    writeSession(next);
  }, [state.sessionType]);

  const logout = useCallback(async () => {
    if (state.sessionType === "special") {
      await fetchApi("/special-users/logout", {
        method: "GET",
        onUnauthorizedRedirectTo: null
      }).catch(() => null);
    } else if (state.sessionType === "user") {
      await fetchApi("/user/auth/logout", {
        method: "GET",
        onUnauthorizedRedirectTo: null
      }).catch(() => null);
    }

    clearStoredUser();
    clearStoredSpecialUser();
    clearSession();
    setState({ sessionType: null, user: null, specialUser: null });
  }, [state.sessionType]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signupAsUser,
        loginAsSpecialUser,
        loginAsUser,
        logout,
        isSpecialSession: state.sessionType === "special"
      }}>
      
      {children}
    </AuthContext.Provider>);

}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
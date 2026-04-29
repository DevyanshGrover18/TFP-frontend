"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { fetchApi } from "@/app/services/api";
import {
  clearStoredSpecialUser,
  getStoredSpecialUser,
  getStoredUser,
  clearStoredUser,
  storeSpecialUser,
  storeUser,
} from "@/app/services/userSession";

export type SessionType = "user" | "special" | null;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type SpecialUser = {
  id: string;
  name: string;
  email: string;
  allowedCategories: string[];
};

type AuthState = {
  sessionType: SessionType;
  user: AuthUser | null;
  specialUser: SpecialUser | null;
};

type AuthContextValue = AuthState & {
  signupAsUser: (name: string, email: string, password: string) => Promise<void>;
  loginAsSpecialUser: (email: string, password: string) => Promise<void>;
  loginAsUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSpecialSession: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "tfp_session";

function readSession(): AuthState {
  if (typeof window === "undefined") {
    return { sessionType: null, user: null, specialUser: null };
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return readStoredSession();
    return JSON.parse(raw) as AuthState;
  } catch {
    return readStoredSession();
  }
}

function readStoredSession(): AuthState {
  const storedSpecialUser = getStoredSpecialUser();
  if (storedSpecialUser) {
    return {
      sessionType: "special",
      user: null,
      specialUser: {
        id: storedSpecialUser.id,
        name: storedSpecialUser.name,
        email: storedSpecialUser.email,
        allowedCategories: storedSpecialUser.allowedCategories ?? [],
      },
    };
  }

  const storedUser = getStoredUser();
  if (storedUser) {
    return {
      sessionType: "user",
      user: storedUser,
      specialUser: null,
    };
  }

  return { sessionType: null, user: null, specialUser: null };
}

function writeSession(state: AuthState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    sessionType: null,
    user: null,
    specialUser: null,
  });

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    const saved = readSession();
    if (saved.sessionType) {
      setState(saved);
    }
  }, []);

  const loginAsSpecialUser = useCallback(
    async (email: string, password: string) => {
      // If a regular user session is active, log them out first
      if (state.sessionType === "user") {
        await fetchApi("/user/auth/logout", {
          method: "GET",
          onUnauthorizedRedirectTo: null,
        }).catch(() => null); // don't block special login if this fails
      }

      const data = await fetchApi<{
        success: boolean;
        message?: string;
        user?: SpecialUser;
      }>("/special-users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        onUnauthorizedRedirectTo: null,
      });

      if (!data.success || !data.user) {
        throw new Error(data.message ?? "Login failed");
      }

      const next: AuthState = {
        sessionType: "special",
        user: null,
        specialUser: data.user,
      };

      clearStoredUser();
      clearStoredSpecialUser();
      storeSpecialUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isSpecial: true,
        allowedCategories: data.user.allowedCategories,
      });
      setState(next);
      writeSession(next);
    },
    [state.sessionType],
  );

  const signupAsUser = useCallback(
    async (name: string, email: string, password: string) => {
      if (state.sessionType === "special") {
        await fetchApi("/special-users/logout", {
          method: "GET",
          onUnauthorizedRedirectTo: null,
        }).catch(() => null);
      }

      const data = await fetchApi<{
        success: boolean;
        message?: string;
        user?: AuthUser;
      }>("/user/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        onUnauthorizedRedirectTo: null,
      });

      if (!data.success || !data.user) {
        throw new Error(data.message ?? "Signup failed");
      }

      const next: AuthState = {
        sessionType: "user",
        user: data.user,
        specialUser: null,
      };

      clearStoredSpecialUser();
      storeUser(data.user);
      setState(next);
      writeSession(next);
    },
    [state.sessionType],
  );

  const loginAsUser = useCallback(async (email: string, password: string) => {
    // If a special session is active, clear it first
    if (state.sessionType === "special") {
      await fetchApi("/special-users/logout", {
        method: "GET",
        onUnauthorizedRedirectTo: null,
      }).catch(() => null);
    }

    const data = await fetchApi<{
      success: boolean;
      message?: string;
      user?: AuthUser;
    }>("/user/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      onUnauthorizedRedirectTo: null,
    });

    if (!data.success || !data.user) {
      throw new Error(data.message ?? "Login failed");
    }

    const next: AuthState = {
      sessionType: "user",
      user: data.user,
      specialUser: null,
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
        onUnauthorizedRedirectTo: null,
      }).catch(() => null);
    } else if (state.sessionType === "user") {
      await fetchApi("/user/auth/logout", {
        method: "GET",
        onUnauthorizedRedirectTo: null,
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
        isSpecialSession: state.sessionType === "special",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

import { authClient } from "@/lib/auth-client";
import { clearAuthToken } from "@/lib/auth-token";
import type { LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: { code: string; message: string } | null;
};

type AuthActions = {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};

type AuthContextValue = AuthState & AuthActions;

function mapBetterAuthUser(baUser: { id: string; email: string; name?: string | null; image?: string | null }): User {
  return {
    id: baUser.id,
    email: baUser.email,
    name: baUser.name ?? undefined,
    avatarUrl: baUser.image ?? undefined,
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, error: sessionError } = authClient.useSession();
  const [error, setError] = useState<AuthState["error"]>(null);

  const user: User | null =
    session?.user != null ? mapBetterAuthUser(session.user as Parameters<typeof mapBetterAuthUser>[0]) : null;

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setError(null);
    const { data, error: err } = await authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
    });
    if (err) {
      const e = err as { code?: string; status?: number; message?: string };
      const code: string = e.code != null ? e.code : String(e.status ?? "UNKNOWN");
      const message: string = e.message ? e.message : "Sign in failed";
      setError({ code, message });
      return false;
    }
    return data != null;
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    setError(null);
    const { data, error: err } = await authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name ?? "",
    });
    if (err) {
      const e = err as { code?: string; status?: number; message?: string };
      const code: string = e.code != null ? e.code : String(e.status ?? "UNKNOWN");
      const message: string = e.message ? e.message : "Sign up failed";
      setError({ code, message });
      return false;
    }
    return data != null;
  }, []);

  const logout = useCallback(() => {
    setError(null);
    clearAuthToken();
    void authClient.signOut();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const displayError =
    error ?? (sessionError ? { code: "SESSION", message: (sessionError as { message?: string }).message || "Session error" } : null);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error: displayError,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

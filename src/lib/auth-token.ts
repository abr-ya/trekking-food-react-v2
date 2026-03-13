const STORAGE_KEY = "auth_bearer_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEY, token);
}

export function clearAuthToken(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

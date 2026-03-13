import { getAuthToken } from "./auth-token";

const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function getApiBaseUrl(): string {
  return baseURL;
}

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: Record<string, unknown> };

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = `${baseURL}${path.startsWith("/") ? path : `/${path}`}`;
  const { body, ...init } = options;
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init.headers,
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return undefined as unknown as T;
}

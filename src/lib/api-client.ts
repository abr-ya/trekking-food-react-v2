import { getAuthToken } from "./auth-token";
import { toastError } from "./toast";

const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function getApiBaseUrl(): string {
  return baseURL;
}

function showNetworkErrorToast(message: string): void {
  toastError(message);
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

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      credentials: "include",
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const message = err instanceof TypeError && err.message === "Failed to fetch"
      ? "Network error. Check your connection and try again."
      : err instanceof Error
        ? err.message
        : "Network error";
    showNetworkErrorToast(message);
    throw err;
  }

  if (!res.ok) {
    const statusMessages: Record<number, string> = {
      502: "Bad Gateway. The server is temporarily unavailable.",
      503: "Service Unavailable. Please try again later.",
      504: "Gateway Timeout. The server took too long to respond.",
    };
    const statusMessage = statusMessages[res.status] ?? `Request failed (${res.status})`;
    let responseMessage: string | null = null;
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text) as { message?: string; error?: string; msg?: string };
          responseMessage = json.message ?? json.error ?? json.msg ?? text;
        } catch {
          responseMessage = text;
        }
      }
    } catch {
      // Body read failed (e.g. 504 with closed connection)
    }
    const message = responseMessage ? `${statusMessage} From server: ${responseMessage}` : statusMessage;
    console.log(message);
    showNetworkErrorToast(message);
    throw new Error(message);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return undefined as unknown as T;
}

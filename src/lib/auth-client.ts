import { createAuthClient } from "better-auth/react";
import { setAuthToken } from "./auth-token";

const envUrl = import.meta.env.VITE_API_URL as string | undefined;
const baseURL =
  typeof envUrl === "string" && (envUrl.startsWith("http://") || envUrl.startsWith("https://"))
    ? envUrl.replace(/\/$/, "")
    : typeof window !== "undefined"
      ? window.location.origin
      : "";

/**
 * Better Auth client. Uses VITE_API_URL when it's a full URL;
 * otherwise uses same origin (so Vite proxy /api works in dev).
 * Stores Bearer token from set-auth-token response header for API requests.
 * @see https://better-auth.com/docs/basic-usage
 * @see https://better-auth.com/docs/plugins/bearer
 */
export const authClient = createAuthClient({
  baseURL: baseURL || undefined,
  fetchOptions: {
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) setAuthToken(token);
    },
  },
});

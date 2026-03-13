import { createAuthClient } from "better-auth/react";
import { setAuthToken } from "./auth-token";

const envUrl =
  (import.meta.env.VITE_AUTH_URL as string | undefined) ??
  (import.meta.env.VITE_API_URL as string | undefined);
// const baseURL = envUrl?.replace(/\/$/, "");
  // todo: what about this check?
  // typeof envUrl === "string" && (envUrl.startsWith("http://") || envUrl.startsWith("https://"))
  //   ? envUrl.replace(/\/$/, "")
  //   : typeof window !== "undefined"
  //     ? window.location.origin
  //     : "";
// Define the base URL for authentication
const getAuthBaseURL = () => {
  // In production on Netlify we use the current domain
  if (import.meta.env.PROD) {
    return `${window.location.origin}${envUrl}/api/auth`;
  }
  // In development we use the local or real API
  return envUrl; // your real API for development
};

/**
 * Better Auth client. Uses VITE_API_URL when it's a full URL;
 * otherwise uses same origin (so Vite proxy /api works in dev).
 * Stores Bearer token from set-auth-token response header for API requests.
 * @see https://better-auth.com/docs/basic-usage
 * @see https://better-auth.com/docs/plugins/bearer
 */
export const authClient = createAuthClient({
  baseURL: getAuthBaseURL() ?? undefined,
  fetchOptions: {
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) setAuthToken(token);
    },
  },
});

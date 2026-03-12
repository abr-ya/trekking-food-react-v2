import { createAuthClient } from "better-auth/react";

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
 * @see https://better-auth.com/docs/basic-usage
 */
export const authClient = createAuthClient({
  baseURL: baseURL || undefined,
});

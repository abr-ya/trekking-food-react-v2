import type { User } from "@/types/auth";

export const APP_ADMIN_ROLE = "admin";

export const isAppAdmin = (user: User | null | undefined): boolean => user?.role === APP_ADMIN_ROLE;

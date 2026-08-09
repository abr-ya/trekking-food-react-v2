import { routes } from "./app-routes";
import type { NavLabelKey } from "@/i18n/resources";

export type MainNavItem = {
  labelKey: NavLabelKey;
  path: string;
  /** Shown only when `isAppAdmin(user)` is true. */
  requiresAppAdmin?: boolean;
};

export const MAIN_NAV: MainNavItem[] = [
  { labelKey: "nav.home", path: routes.home },
  { labelKey: "nav.products", path: routes.products },
  { labelKey: "nav.recipes", path: routes.recipes },
  { labelKey: "nav.categories", path: routes.categories },
  { labelKey: "nav.hikings", path: routes.hikings },
  { labelKey: "nav.about", path: routes.about },
  { labelKey: "nav.admin", path: routes.admin, requiresAppAdmin: true },
];

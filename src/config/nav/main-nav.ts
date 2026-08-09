import { routes } from "./app-routes";

export type MainNavItem = {
  label: string;
  path: string;
  /** Shown only when `isAppAdmin(user)` is true. */
  requiresAppAdmin?: boolean;
};

export const MAIN_NAV: MainNavItem[] = [
  { label: "Home", path: routes.home },
  { label: "Products", path: routes.products },
  { label: "Recipes", path: routes.recipes },
  { label: "Categories", path: routes.categories },
  { label: "Hikings", path: routes.hikings },
  { label: "About", path: routes.about },
  { label: "Admin", path: routes.admin, requiresAppAdmin: true },
];

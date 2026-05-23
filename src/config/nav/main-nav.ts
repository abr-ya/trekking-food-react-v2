export type MainNavItem = {
  label: string;
  path: string;
  /** Shown only when `isAppAdmin(user)` is true. */
  requiresAppAdmin?: boolean;
};

export const MAIN_NAV: MainNavItem[] = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Recipes", path: "/recipes" },
  { label: "Categories", path: "/categories" },
  { label: "Hikings", path: "/hikings" },
  { label: "About", path: "/about" },
  { label: "Admin", path: "/admin", requiresAppAdmin: true },
];

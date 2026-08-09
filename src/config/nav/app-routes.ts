/** Route paths declared in `App.tsx` — single source for menu + router. */
export const routes = {
  home: "/",
  products: "/products",
  categories: "/categories",
  recipes: "/recipes",
  recipeDetail: "/recipes/:id",
  hikings: "/hikings",
  hikingDetail: "/hikings/:id",
  about: "/about",
  admin: "/admin",
} as const;

/** Top-level destinations that appear in `MAIN_NAV` (no `:id` segments). */
export const TOP_LEVEL_ROUTE_PATHS: readonly string[] = [
  routes.home,
  routes.products,
  routes.categories,
  routes.recipes,
  routes.hikings,
  routes.about,
  routes.admin,
];

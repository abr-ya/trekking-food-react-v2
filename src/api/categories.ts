import { apiFetch } from "@/lib/api-client";
import type { CategoriesListResponse, ProductCategory } from "@/types/category";

/**
 * `GET /product-categories` — expects `{ data: ProductCategory[] }` or a plain array (wrapped into `{ data }`).
 */
export async function getProductCategories(): Promise<CategoriesListResponse> {
  const raw = await apiFetch<ProductCategory[] | CategoriesListResponse>("/product-categories", {
    method: "GET",
  });
  if (Array.isArray(raw)) {
    return { data: raw };
  }
  return { data: raw.data ?? [] };
}

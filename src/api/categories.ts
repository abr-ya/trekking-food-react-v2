import { apiFetch } from "@/lib/api-client";
import type {
  CategoriesListResponse,
  ProductCategory,
  RecipeCategoriesListResponse,
  RecipeCategory,
} from "@/types/category";

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

/**
 * `GET /recipe-categories` — expects `{ data: RecipeCategory[] }` or a plain array (wrapped into `{ data }`).
 */
export async function getRecipeCategories(): Promise<RecipeCategoriesListResponse> {
  const raw = await apiFetch<RecipeCategory[] | RecipeCategoriesListResponse>("/recipe-categories", {
    method: "GET",
  });
  if (Array.isArray(raw)) {
    return { data: raw };
  }
  return { data: raw.data ?? [] };
}

export type SaveCategoryNamePayload = { name: string };

export async function postProductCategory(payload: SaveCategoryNamePayload): Promise<unknown> {
  return apiFetch("/product-categories", { method: "POST", body: payload });
}

export async function patchProductCategory(id: string, payload: SaveCategoryNamePayload): Promise<unknown> {
  return apiFetch(`/product-categories/${encodeURIComponent(id)}`, { method: "PATCH", body: payload });
}

export async function postRecipeCategory(payload: SaveCategoryNamePayload): Promise<unknown> {
  return apiFetch("/recipe-categories", { method: "POST", body: payload });
}

export async function patchRecipeCategory(id: string, payload: SaveCategoryNamePayload): Promise<unknown> {
  return apiFetch(`/recipe-categories/${encodeURIComponent(id)}`, { method: "PATCH", body: payload });
}

export async function deleteProductCategory(id: string): Promise<unknown> {
  return apiFetch(`/product-categories/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function deleteRecipeCategory(id: string): Promise<unknown> {
  return apiFetch(`/recipe-categories/${encodeURIComponent(id)}`, { method: "DELETE" });
}

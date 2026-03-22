import { apiFetch } from "@/lib/api-client";
import type {
  CreateRecipePayload,
  Recipe,
  RecipesListResponse,
  RecipesMeta,
  RecipesListParams,
} from "@/types/recipe";

function metaFromListLength(length: number): RecipesMeta {
  return {
    total: length,
    page: 1,
    limit: length,
    totalPages: length > 0 ? 1 : 0,
  };
}

function recipesListQueryString(params: RecipesListParams): string {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  const q = params.search?.trim();
  if (q) sp.set("search", q);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/**
 * `GET /recipes` — paginated, optional `search` (name filter). Expects `{ data, meta }`; plain arrays are normalized.
 */
export async function getRecipes(params: RecipesListParams = {}): Promise<RecipesListResponse> {
  const path = `/recipes${recipesListQueryString(params)}`;
  const raw = await apiFetch<Recipe[] | RecipesListResponse>(path, { method: "GET" });
  if (Array.isArray(raw)) {
    return { data: raw, meta: metaFromListLength(raw.length) };
  }
  return {
    data: raw.data ?? [],
    meta: raw.meta ?? metaFromListLength(raw.data?.length ?? 0),
  };
}

/**
 * `POST /recipes` — create a recipe (auth as required by the API).
 */
export async function postRecipe(payload: CreateRecipePayload): Promise<unknown> {
  return apiFetch("/recipes", {
    method: "POST",
    body: payload,
  });
}

import { apiFetch } from "@/lib/api-client";
import type {
  CreateRecipePayload,
  Recipe,
  RecipeApiRow,
  RecipeIngredient,
  RecipeIngredientApiRow,
  RecipesListParams,
  RecipesListResponse,
  RecipesMeta,
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

function normalizeIngredient(row: RecipeIngredientApiRow): RecipeIngredient {
  return {
    id: row.id,
    recipeId: row.recipe_id,
    productId: row.product_id,
    quantity: row.quantity,
    product: {
      id: row.product.id,
      name: row.product.name,
      kkal: row.product.kkal,
      proteins: row.product.proteins,
      fats: row.product.fats,
      carbohydrates: row.product.carbohydrates,
      price: row.product.price,
      isVegetarian: row.product.is_vegetarian,
      productCategoryId: row.product.product_category_id,
      isCommon: row.product.is_common,
      userId: row.product.user_id,
    },
  };
}

function normalizeRecipe(row: RecipeApiRow): Recipe {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    isCommon: row.is_common,
    userId: row.user_id,
    category: row.category,
    ingredients: (row.ingredients ?? []).map(normalizeIngredient),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * `GET /recipes` — paginated, optional `search` (name filter). Expects `{ data, meta }`; plain arrays are normalized.
 */
export async function getRecipes(params: RecipesListParams = {}): Promise<RecipesListResponse> {
  const path = `/recipes${recipesListQueryString(params)}`;
  type RawListResponse = { data: RecipeApiRow[]; meta?: RecipesMeta };
  const raw = await apiFetch<RecipeApiRow[] | RawListResponse>(path, { method: "GET" });
  if (Array.isArray(raw)) {
    const data = raw.map(normalizeRecipe);
    return { data, meta: metaFromListLength(data.length) };
  }
  const data = (raw.data ?? []).map(normalizeRecipe);
  return {
    data,
    meta: raw.meta ?? metaFromListLength(data.length),
  };
}

/**
 * `GET /recipes/:id` — fetch a single recipe by ID.
 */
export async function getRecipe(id: string): Promise<Recipe> {
  const raw = await apiFetch<RecipeApiRow>(`/recipes/${encodeURIComponent(id)}`, { method: "GET" });
  return normalizeRecipe(raw);
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

/**
 * `DELETE /recipes/:recipeId/ingredients/:ingredientId` — delete an ingredient from a recipe.
 */
export async function deleteRecipeIngredient(recipeId: string, ingredientId: string): Promise<unknown> {
  return apiFetch(`/recipes/${encodeURIComponent(recipeId)}/ingredients/${encodeURIComponent(ingredientId)}`, {
    method: "DELETE",
  });
}

/**
 * `POST /recipes/:recipeId/ingredients` — add an ingredient to a recipe.
 */
export async function addRecipeIngredient(
  recipeId: string,
  payload: { productId: string; quantity: number },
): Promise<unknown> {
  return apiFetch(`/recipes/${encodeURIComponent(recipeId)}/ingredients`, {
    method: "POST",
    body: payload,
  });
}

/**
 * `PATCH /recipes/:recipeId/ingredients/:ingredientId` — update ingredient quantity.
 */
export async function updateRecipeIngredient(
  recipeId: string,
  ingredientId: string,
  payload: { quantity: number },
): Promise<unknown> {
  return apiFetch(`/recipes/${encodeURIComponent(recipeId)}/ingredients/${encodeURIComponent(ingredientId)}`, {
    method: "PATCH",
    body: payload,
  });
}

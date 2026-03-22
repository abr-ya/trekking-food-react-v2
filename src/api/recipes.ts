import { apiFetch } from "@/lib/api-client";
import type { CreateRecipePayload } from "@/types/recipe";

/**
 * `POST /recipes` — create a recipe (auth as required by the API).
 */
export async function postRecipe(payload: CreateRecipePayload): Promise<unknown> {
  return apiFetch("/recipes", {
    method: "POST",
    body: payload,
  });
}

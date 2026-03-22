/** Single ingredient line when creating a recipe (POST /recipes). */
export type CreateRecipeIngredient = {
  productId: string;
  quantity: number;
};

export type CreateRecipePayload = {
  name: string;
  categoryId: string;
  description: string;
  ingredients: CreateRecipeIngredient[];
  isCommon: boolean;
};

/** Full recipe row from `GET /recipes` (aligned with create payload + server fields). */
export type Recipe = CreateRecipePayload & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Pagination from `GET /recipes` when the API returns `{ data, meta }` (same shape as products). */
export type RecipesMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type RecipesListResponse = {
  data: Recipe[];
  meta: RecipesMeta;
};

/** Query params for paginated / searchable recipe list (`GET /recipes?...`). */
export type RecipesListParams = {
  page?: number;
  limit?: number;
  /** Server-side name filter (omit or empty = no filter). */
  search?: string;
};

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

/** Fields allowed on `PATCH /recipes/:id` (server may accept a subset). */
export type UpdateRecipePayload = Partial<{
  name: string;
  description: string;
  categoryId: string;
}>;

/** Nested category on a recipe (from the API). */
export type RecipeCategory = {
  id: string;
  name: string;
};

/** Nested product snapshot inside an ingredient (from the API). */
export type RecipeIngredientProduct = {
  id: string;
  name: string;
  kkal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  price: number;
  isVegetarian: boolean;
  productCategoryId: string;
  isCommon: boolean;
  userId?: string;
};

/** Normalized ingredient row (camelCase, client-side). */
export type RecipeIngredient = {
  id: string;
  recipeId: string;
  productId: string;
  quantity: number;
  product: RecipeIngredientProduct;
};

/** Full recipe row — normalized (camelCase, client-side). */
export type Recipe = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  isCommon: boolean;
  userId?: string;
  category?: RecipeCategory;
  ingredients: RecipeIngredient[];
  createdAt?: string;
  updatedAt?: string;
};

// ---------------------------------------------------------------------------
// Raw API shapes (snake_case)
// ---------------------------------------------------------------------------

/** Raw nested product inside an ingredient row from the API. */
export type RecipeIngredientProductApiRow = {
  id: string;
  name: string;
  kkal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  price: number;
  is_vegetarian: boolean;
  product_category_id: string;
  is_common: boolean;
  user_id?: string;
};

/** Raw ingredient row from the API (snake_case). */
export type RecipeIngredientApiRow = {
  id: string;
  recipe_id: string;
  product_id: string;
  quantity: number;
  product: RecipeIngredientProductApiRow;
};

/** Raw recipe row returned by `GET /recipes/:id` and `GET /recipes` (snake_case). */
export type RecipeApiRow = {
  id: string;
  user_id?: string;
  category_id: string;
  name: string;
  description: string;
  is_common: boolean;
  category?: RecipeCategory;
  ingredients: RecipeIngredientApiRow[];
  created_at?: string;
  updated_at?: string;
};

/** Pagination from `GET /recipes` when the API returns `{ data, meta }`. */
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

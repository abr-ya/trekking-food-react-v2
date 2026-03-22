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

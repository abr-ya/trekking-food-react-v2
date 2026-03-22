import type { ProductPreview } from "./product";

export type ProductCategory = {
  id: string;
  name: string;
  products: ProductPreview[];
};

export type CategoriesListResponse = {
  data: ProductCategory[];
};

/** Lightweight recipe reference when nested under a category (API shape). */
export type RecipePreview = {
  id: string;
  name: string;
};

export type RecipeCategory = {
  id: string;
  name: string;
  recipes: RecipePreview[];
};

export type RecipeCategoriesListResponse = {
  data: RecipeCategory[];
};

export type CategoryKind = "product" | "recipe";

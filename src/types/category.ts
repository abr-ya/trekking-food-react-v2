import type { ProductPreview } from "./product";

export type ProductCategory = {
  id: string;
  name: string;
  products: ProductPreview[];
};

export type CategoriesListResponse = {
  data: ProductCategory[];
};

export type CreateProductPayload = {
  name: string;
  kkal: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  price: number;
  isVegetarian: boolean;
  productCategoryId: string;
  isCommon: boolean;
};

/** Fields allowed on `PATCH /products/:id` (server may accept a subset). */
export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductCategory = {
  id: string;
  name: string;
};

export type Product = CreateProductPayload & {
  id: string;
  userId?: string;
  category?: ProductCategory;
  createdAt?: string;
  updatedAt?: string;
};

/** Raw shape returned by `GET /products` (snake_case from the server). */
export type ProductApiRow = {
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
  category?: ProductCategory;
};

export type ProductPreview = Pick<Product, "id" | "name">;

/** Pagination / totals from `GET /products` when the API returns `{ data, meta }`. */
export type ProductsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductsListResponse = {
  data: Product[];
  meta: ProductsMeta;
};

/** Query params for `GET /products?...` (optional pagination + name search, same idea as recipes). */
export type ProductsListParams = {
  page?: number;
  limit?: number;
  /** Server-side name filter (omit or empty = no filter). */
  search?: string;
  /** Filter by one or more category IDs; serialized as comma-joined string. */
  categoryId?: string[];
};

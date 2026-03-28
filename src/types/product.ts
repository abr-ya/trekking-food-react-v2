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

export type Product = CreateProductPayload & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
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

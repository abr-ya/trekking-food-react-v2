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

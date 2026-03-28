import { apiFetch } from "@/lib/api-client";
import type {
  CreateProductPayload,
  Product,
  ProductApiRow,
  ProductsListParams,
  ProductsListResponse,
  ProductsMeta,
  UpdateProductPayload,
} from "@/types/product";

function normalizeProduct(row: ProductApiRow): Product {
  return {
    id: row.id,
    name: row.name,
    kkal: row.kkal,
    proteins: row.proteins,
    fats: row.fats,
    carbohydrates: row.carbohydrates,
    price: row.price,
    isVegetarian: row.is_vegetarian,
    productCategoryId: row.product_category_id,
    isCommon: row.is_common,
    userId: row.user_id,
    category: row.category,
  };
}

function metaFromListLength(length: number): ProductsMeta {
  return {
    total: length,
    page: 1,
    limit: length,
    totalPages: length > 0 ? 1 : 0,
  };
}

function productsListQueryString(params: ProductsListParams): string {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  const q = params.search?.trim();
  if (q) sp.set("search", q);
  if (params.categoryId?.length) sp.set("categoryId", params.categoryId.join(","));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/**
 * `GET /products` — optional `page`, `limit`, `search` (name filter). Expects `{ data, meta }`; plain arrays are normalized.
 */
type RawProductsListResponse = { data: ProductApiRow[]; meta?: ProductsMeta };

export async function getProducts(params: ProductsListParams = {}): Promise<ProductsListResponse> {
  const path = `/products${productsListQueryString(params)}`;
  const raw = await apiFetch<ProductApiRow[] | RawProductsListResponse>(path, { method: "GET" });
  if (Array.isArray(raw)) {
    const data = raw.map(normalizeProduct);
    return { data, meta: metaFromListLength(data.length) };
  }
  const data = (raw.data ?? []).map(normalizeProduct);
  return {
    data,
    meta: raw.meta ?? metaFromListLength(data.length),
  };
}

export async function postProduct(payload: CreateProductPayload): Promise<unknown> {
  return apiFetch("/products", {
    method: "POST",
    body: payload,
  });
}

export async function patchProduct(id: string, payload: UpdateProductPayload): Promise<unknown> {
  return apiFetch(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteProduct(id: string): Promise<unknown> {
  return apiFetch(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

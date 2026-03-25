import { apiFetch } from "@/lib/api-client";
import type {
  CreateProductPayload,
  Product,
  ProductsListParams,
  ProductsListResponse,
  ProductsMeta,
  UpdateProductPayload,
} from "@/types/product";

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
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/**
 * `GET /products` — optional `page`, `limit`, `search` (name filter). Expects `{ data, meta }`; plain arrays are normalized.
 */
export async function getProducts(params: ProductsListParams = {}): Promise<ProductsListResponse> {
  const path = `/products${productsListQueryString(params)}`;
  const raw = await apiFetch<Product[] | ProductsListResponse>(path, { method: "GET" });
  if (Array.isArray(raw)) {
    return { data: raw, meta: metaFromListLength(raw.length) };
  }
  return {
    data: raw.data ?? [],
    meta: raw.meta ?? metaFromListLength(raw.data?.length ?? 0),
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

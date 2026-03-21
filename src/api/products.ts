import { apiFetch } from "@/lib/api-client";
import type {
  CreateProductPayload,
  Product,
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

/**
 * `GET /products` — expects `{ data: Product[], meta }` from the API.
 * If the server still returns a plain array, it is wrapped into that shape.
 */
export async function getProducts(): Promise<ProductsListResponse> {
  const raw = await apiFetch<Product[] | ProductsListResponse>("/products", { method: "GET" });
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

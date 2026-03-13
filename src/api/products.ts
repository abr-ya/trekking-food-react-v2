import { apiFetch } from "@/lib/api-client";
import type { CreateProductPayload } from "@/types/product";

export async function postProduct(payload: CreateProductPayload): Promise<unknown> {
  return apiFetch("/products", {
    method: "POST",
    body: payload,
  });
}

import { apiFetch } from "@/lib/api-client";
import type { CreateProductPayload, Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products", { method: "GET" });
}

export async function postProduct(payload: CreateProductPayload): Promise<unknown> {
  return apiFetch("/products", {
    method: "POST",
    body: payload,
  });
}

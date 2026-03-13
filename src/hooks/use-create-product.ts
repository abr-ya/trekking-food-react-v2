import { useMutation } from "@tanstack/react-query";
import { postProduct } from "@/api/products";
import type { CreateProductPayload } from "@/types/product";

export function useCreateProduct() {
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => postProduct(payload),
  });
}

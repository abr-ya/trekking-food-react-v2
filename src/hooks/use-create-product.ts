import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postProduct } from "@/api/products";
import { productsQueryKey } from "./use-products";
import type { CreateProductPayload } from "@/types/product";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => postProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}

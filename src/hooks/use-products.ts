import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProducts, patchProduct, postProduct } from "@/api/products";
import type { CreateProductPayload, UpdateProductPayload } from "@/types/product";

/** TanStack Query keys for product API. */
export const productQueryKeys = {
  all: ["products"] as const,
  list: () => [...productQueryKeys.all, "list"] as const,
};

/** How long product list data stays “fresh” before TanStack Query may refetch on mount/focus. */
const PRODUCTS_STALE_TIME_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Fetch all products (TanStack Query `useQuery`).
 */
export const useProducts = () =>
  useQuery({
    queryKey: productQueryKeys.list(),
    queryFn: getProducts,
    staleTime: PRODUCTS_STALE_TIME_MS,
  });

/**
 * Create a product (TanStack Query `useMutation`).
 * On success, invalidates the products list query so `useProducts` refetches.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => postProduct(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
  });
};

/**
 * Update a product (`PATCH /products/:id`). On success, invalidates product list queries.
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) => patchProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
  });
};

/**
 * Delete a product (`DELETE /products/:id`). On success, invalidates product list queries.
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};

import { useCallback } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { UseMutateFunction } from "@tanstack/react-query";

import { getProducts } from "@/api/products";
import { productQueryKeys } from "@/hooks/use-products";
import { addRecipeIngredientSchema, type AddRecipeIngredientFormData } from "@/schemas/add-recipe-ingredient";
import type { SelectWithSearchOption } from "@/components";
import type { Product } from "@/types/product";
import type { AddRecipeIngredientVariables } from "@/hooks";
import { RHFInput, RHFSelectWithSearch } from "@/components/rhf";

type Props = {
  recipeId: string;
  mutate: UseMutateFunction<unknown, Error, AddRecipeIngredientVariables>;
  isError: boolean;
  error: Error | null;
  resetMutation: () => void;
  onSuccess?: () => void;
};

const mapProductToOption = (p: Product): SelectWithSearchOption => ({ label: p.name, value: p.id });

const defaultValues: AddRecipeIngredientFormData = {
  product: { label: "", value: "" },
  quantity: 0,
};

export function AddRecipeIngredientForm({ recipeId, mutate, isError, error, resetMutation, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<AddRecipeIngredientFormData>({
    resolver: zodResolver(addRecipeIngredientSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const searchProducts = useCallback(
    (query: string) =>
      queryClient
        .fetchQuery({
          queryKey: productQueryKeys.list({ search: query }),
          queryFn: () => getProducts({ search: query }),
        })
        .then((res) => res.data),
    [queryClient],
  );

  const onSubmit: SubmitHandler<AddRecipeIngredientFormData> = (data) => {
    mutate(
      {
        recipeId,
        payload: {
          productId: data.product.value,
          quantity: data.quantity,
        },
      },
      {
        onSuccess: () => {
          form.reset(defaultValues);
          resetMutation();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <FormProvider {...form}>
      <form id="add-recipe-ingredient-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFSelectWithSearch<Product, AddRecipeIngredientFormData>
          name="product"
          label="Product"
          placeholder="Type to search…"
          searchRequest={searchProducts}
          mapFunc={mapProductToOption}
          minForSearch={1}
        />

        <RHFInput<AddRecipeIngredientFormData> name="quantity" label="Quantity (g)" isNumber />

        {isError ? (
          <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
        ) : null}
      </form>
    </FormProvider>
  );
}

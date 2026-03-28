import { useCallback } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { UseMutateFunction } from "@tanstack/react-query";

import { getProducts } from "@/api/products";
import { productQueryKeys } from "@/hooks/use-products";
import { addProductToHikingSchema, type AddProductToHikingFormData } from "@/schemas/add-product-to-hiking";
import type { SelectWithSearchOption } from "@/components";
import type { Product } from "@/types/product";
import type { AddHikingProductVariables } from "@/hooks";
import { RHFInput, RHFSelectWithSearch } from "@/components/rhf";

type Props = {
  hikingId: string;
  dayNumber: number;
  eatingTimeId: string;
  mutate: UseMutateFunction<unknown, Error, AddHikingProductVariables>;
  isError: boolean;
  error: Error | null;
  resetMutation: () => void;
  onSuccess?: () => void;
};

const mapProductToOption = (p: Product): SelectWithSearchOption => ({ label: p.name, value: p.id });

const defaultValues: AddProductToHikingFormData = {
  product: null,
  personalQuantity: 0,
  totalQuantity: 0,
};

export function AddProductToHikingForm({
  hikingId,
  dayNumber,
  eatingTimeId,
  mutate,
  isError,
  error,
  resetMutation,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<AddProductToHikingFormData>({
    resolver: zodResolver(addProductToHikingSchema),
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

  const onSubmit: SubmitHandler<AddProductToHikingFormData> = (data) => {
    mutate(
      {
        hikingId,
        payload: {
          dayNumber,
          eatingTimeId,
          productId: data.product!.value,
          personalQuantity: data.personalQuantity,
          ...(data.totalQuantity !== 0 && { totalQuantity: data.totalQuantity }),
          recipeId: null,
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
      <form id="add-product-to-hiking-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFSelectWithSearch<Product, AddProductToHikingFormData>
          name="product"
          label="Product"
          placeholder="Type to search…"
          searchRequest={searchProducts}
          mapFunc={mapProductToOption}
          minForSearch={1}
        />

        <div className="flex gap-3">
          <div className="flex-1">
            <RHFInput<AddProductToHikingFormData> name="personalQuantity" label="Personal qty (g)" isNumber />
          </div>
          <div className="flex-1">
            <RHFInput<AddProductToHikingFormData> name="totalQuantity" label="Total qty (g)" isNumber />
          </div>
        </div>

        {isError ? (
          <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
        ) : null}
      </form>
    </FormProvider>
  );
}

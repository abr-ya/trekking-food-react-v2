import { useMemo } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutateFunction } from "@tanstack/react-query";
import { z } from "zod";

import { useRecipes } from "@/hooks";
import type { AddHikingProductsFromRecipeVariables } from "@/hooks";
import { RHFStaticSelect } from "@/components/rhf";
import { type SelectWithSearchOption } from "@/components";
import { LoadingSkeleton } from "@/components";

const schema = z.object({
  recipeId: z.string().min(1, "Select a recipe"),
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  recipeId: "",
};

type Props = {
  hikingId: string;
  dayNumber: number;
  eatingTimeId: string;
  mutate: UseMutateFunction<unknown, Error, AddHikingProductsFromRecipeVariables>;
  isError: boolean;
  error: Error | null;
  resetMutation: () => void;
  onSuccess?: () => void;
};

export function AddRecipeToSlotForm({
  hikingId,
  dayNumber,
  eatingTimeId,
  mutate,
  isError,
  error,
  resetMutation,
  onSuccess,
}: Props) {
  const { data: recipesData, isLoading: recipesLoading, error: recipesError } = useRecipes();

  const recipeOptions = useMemo(
    (): SelectWithSearchOption[] => (recipesData?.data ?? []).map((r) => ({ label: r.name, value: r.id })),
    [recipesData?.data],
  );

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate(
      {
        hikingId,
        payload: {
          recipeId: data.recipeId,
          dayNumber,
          eatingTimeId,
        },
      },
      {
        onSuccess: () => {
          reset(defaultValues);
          resetMutation();
          onSuccess?.();
        },
      },
    );
  };

  if (recipesLoading) return <LoadingSkeleton />;

  if (recipesError) {
    return (
      <p className="text-destructive text-sm">
        Failed to load recipes{recipesError instanceof Error ? `: ${recipesError.message}` : ""}.
      </p>
    );
  }

  if (recipeOptions.length === 0) {
    return <p className="text-muted-foreground text-sm">No recipes yet.</p>;
  }

  return (
    <FormProvider {...form}>
      <form id="add-recipe-to-slot-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFStaticSelect<FormData>
          name="recipeId"
          label="Recipe"
          options={recipeOptions}
          placeholder="Select a recipe"
        />

        {isError ? (
          <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
        ) : null}
      </form>
    </FormProvider>
  );
}

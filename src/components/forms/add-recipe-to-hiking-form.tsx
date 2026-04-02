import { useMemo, useState } from "react";
import { FormProvider, useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useAddHikingProductsFromRecipe, useEatingTimes, useHiking, useRecipes } from "@/hooks";
import { Button, LoadingSkeleton } from "@/components";
import { createAddRecipeToHikingSchema } from "@/schemas/add-recipe-to-hiking";
import { RHFInput, RHFSelect } from "../rhf";

const TEST_MODE = false;

type AddRecipeToHikingFormFieldsProps = {
  hikingId: string;
  daysTotal: number;
  onSuccess: () => void;
};

const AddRecipeToHikingFormFields = ({ hikingId, daysTotal, onSuccess }: AddRecipeToHikingFormFieldsProps) => {
  const schema = useMemo(() => createAddRecipeToHikingSchema(daysTotal), [daysTotal]);
  type FormData = z.infer<typeof schema>;

  const addFromRecipe = useAddHikingProductsFromRecipe();
  const { data: recipesData, isLoading: recipesLoading, error: recipesError } = useRecipes();
  const { data: eatingTimesData, isLoading: timesLoading, error: timesError } = useEatingTimes();

  const recipeOptions = useMemo(
    () => (recipesData?.data ?? []).map((r) => ({ label: r.name, value: r.id })),
    [recipesData?.data],
  );

  const eatingTimeOptions = useMemo(
    () => (eatingTimesData?.data ?? []).map((t) => ({ label: t.name, value: t.id })),
    [eatingTimesData?.data],
  );

  const defaultValues: FormData = {
    recipeId: "",
    dayNumber: 1,
    eatingTimeId: "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { isSubmitting, errors } = form.formState;
  const { handleSubmit } = form;

  const submitHandler: SubmitHandler<FormData> = (data) => {
    if (TEST_MODE) {
      console.log("add recipe to hiking", data);
      return;
    }
    addFromRecipe.mutate(
      {
        hikingId,
        payload: {
          recipeId: data.recipeId,
          dayNumber: data.dayNumber,
          eatingTimeId: data.eatingTimeId,
        },
      },
      { onSuccess: () => onSuccess() },
    );
  };

  const errorHandler: SubmitErrorHandler<FormData> = (errs) => {
    if (TEST_MODE) console.log("errors", errs);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler, errorHandler)} className="w-full mb-4">
        <div className="flex w-full flex-wrap items-end gap-3">
          <div className="grid min-w-[min(100%,14rem)] flex-1 gap-1">
            {recipesLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : recipesError ? (
              <p className="text-destructive text-sm">
                Failed to load recipes{recipesError instanceof Error ? `: ${recipesError.message}` : ""}.
              </p>
            ) : recipeOptions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recipes yet.</p>
            ) : (
              <RHFSelect<FormData> name="recipeId" label="Recipe" options={recipeOptions} placeholder="Recipe" />
            )}
          </div>

          <div className="w-24 shrink-0">
            <RHFInput<FormData>
              name="dayNumber"
              label="Day"
              type="number"
              step={1}
              min={1}
              max={daysTotal}
              id="dayNumber"
              valueAsNumber
              title={`Day 1–${daysTotal}`}
            />
            {errors.dayNumber ? <p className="text-destructive mt-1 text-xs">{errors.dayNumber.message}</p> : null}
          </div>

          <div className="grid min-w-[min(100%,12rem)] flex-1 gap-1">
            {timesLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : timesError ? (
              <p className="text-destructive text-sm">
                Failed to load times{timesError instanceof Error ? `: ${timesError.message}` : ""}.
              </p>
            ) : eatingTimeOptions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No eating times.</p>
            ) : (
              <RHFSelect<FormData>
                name="eatingTimeId"
                label="Eating time"
                options={eatingTimeOptions}
                placeholder="Meal"
              />
            )}
          </div>

          <Button type="submit" className="shrink-0" disabled={addFromRecipe.isPending || isSubmitting}>
            {addFromRecipe.isPending ? "Adding…" : "Add"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export const AddRecipeToHikingForm = ({ hikingId }: { hikingId: string }) => {
  const [formKey, setFormKey] = useState(0);
  const { data: hiking, isLoading, error } = useHiking(hikingId.trim() || undefined);

  if (!hikingId.trim()) return <p className="text-muted-foreground text-sm">Hiking id is missing.</p>;
  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load hiking: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!hiking) {
    return <p className="text-muted-foreground text-sm">Hiking not found.</p>;
  }

  return (
    <AddRecipeToHikingFormFields
      key={`${hikingId}-${hiking.daysTotal}-${formKey}`}
      hikingId={hikingId}
      daysTotal={hiking.daysTotal}
      onSuccess={() => setFormKey((k) => k + 1)}
    />
  );
};

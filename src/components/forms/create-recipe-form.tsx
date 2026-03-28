import { useMemo, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  type Path,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRecipe, useProducts, useRecipeCategories } from "@/hooks";
import { Button } from "@/components/ui/button";
import { inputClassName } from "@/components/ui/input-cursor";
import { cn } from "@/lib/utils";
import { createRecipeSchema, type CreateRecipeFormData } from "@/schemas/recipe";
import { RHFInput, RHFSelect } from "../rhf";

const defaultFormValues: CreateRecipeFormData = {
  name: "",
  categoryId: "",
  description: "",
  ingredients: [{ productId: "", quantity: 0 }],
  isCommon: false,
};

/**
 * Wrapper bumps `key` after a successful create so the inner form remounts with a fresh
 * `useForm` instance. That avoids RHF + zodResolver leaving stale `errors` after `reset()`.
 */
export const CreateRecipeForm = () => {
  const [formKey, setFormKey] = useState(0);

  return <CreateRecipeFormFields key={formKey} onCreated={() => setFormKey((k) => k + 1)} />;
};

const TEST_MODE = false;

const CreateRecipeFormFields = ({ onCreated }: { onCreated: () => void }) => {
  const createRecipe = useCreateRecipe();
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts();
  const {
    data: recipeCategoriesData,
    isLoading: recipeCategoriesLoading,
    error: recipeCategoriesError,
  } = useRecipeCategories();

  const productOptions = useMemo(
    () => (productsData?.data ?? []).map((p) => ({ label: p.name, value: p.id })),
    [productsData?.data],
  );

  const recipeCategoryOptions = useMemo(
    () => (recipeCategoriesData?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    [recipeCategoriesData?.data],
  );

  const form = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "ingredients" });

  const { isSubmitting, errors } = form.formState;
  const { handleSubmit, register } = form;

  const submitHandler: SubmitHandler<CreateRecipeFormData> = (data) => {
    if (TEST_MODE) {
      console.log("submitHandler data", data);
    } else {
      createRecipe.mutate(data, {
        onSuccess: () => {
          onCreated();
        },
      });
    }
  };

  const errorHandler: SubmitErrorHandler<CreateRecipeFormData> = (errs) => {
    if (TEST_MODE) console.log("errorHandler errors", errs);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitHandler, errorHandler)} className="grid max-w-md gap-4">
        <RHFInput<CreateRecipeFormData> name="name" label="Name" helpText="Recipe name" />
        <div className="grid gap-2">
          {recipeCategoriesLoading ? (
            <p className="text-muted-foreground text-sm">Loading recipe categories…</p>
          ) : recipeCategoriesError ? (
            <p className="text-destructive text-sm">
              Failed to load recipe categories
              {recipeCategoriesError instanceof Error ? `: ${recipeCategoriesError.message}` : ""}.
            </p>
          ) : recipeCategoryOptions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recipe categories yet. Add one on the Categories page.</p>
          ) : (
            <RHFSelect<CreateRecipeFormData>
              name="categoryId"
              label="Recipe category"
              options={recipeCategoryOptions}
              placeholder="Select a recipe category"
            />
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="recipe-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="recipe-description"
            rows={3}
            {...register("description")}
            className={cn(inputClassName, "min-h-[80px] py-2")}
            placeholder="Simple breakfast"
          />
          {errors.description ? <p className="text-destructive text-sm">{errors.description.message}</p> : null}
        </div>
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium">Ingredients</span>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1 })}>
              Add ingredient
            </Button>
          </div>
          {productsLoading ? (
            <p className="text-muted-foreground text-sm">Loading products…</p>
          ) : productsError ? (
            <p className="text-destructive text-sm">
              Failed to load products{productsError instanceof Error ? `: ${productsError.message}` : ""}.
            </p>
          ) : productOptions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No products yet. Create products first.</p>
          ) : null}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-end"
            >
              <div className="grid min-w-0 flex-1 gap-2">
                {!productsLoading && !productsError && productOptions.length > 0 ? (
                  <RHFSelect<CreateRecipeFormData>
                    name={`ingredients.${index}.productId` as Path<CreateRecipeFormData>}
                    label="Product"
                    options={productOptions}
                    placeholder="Select product"
                  />
                ) : null}
                {errors.ingredients?.[index]?.productId ? (
                  <p className="text-destructive text-sm">{errors.ingredients[index]?.productId?.message}</p>
                ) : null}
              </div>
              <div className="w-full sm:w-28">
                <RHFInput<CreateRecipeFormData>
                  name={`ingredients.${index}.quantity` as Path<CreateRecipeFormData>}
                  label="Quantity"
                  id={`ingredient-qty-${field.id}`}
                  isNumber
                />
              </div>
              {fields.length > 1 ? (
                <Button type="button" variant="ghost" size="sm" className="shrink-0" onClick={() => remove(index)}>
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
          {errors.ingredients?.root?.message ? (
            <p className="text-destructive text-sm">{errors.ingredients.root.message}</p>
          ) : null}
          {typeof errors.ingredients?.message === "string" ? (
            <p className="text-destructive text-sm">{errors.ingredients.message}</p>
          ) : null}
        </div>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" {...register("isCommon")} className="size-4 rounded border-input" />
          <span className="text-sm font-medium">Common</span>
        </label>
        <Button type="submit" disabled={createRecipe.isPending || isSubmitting}>
          {createRecipe.isPending ? "Creating…" : "Create recipe"}
        </Button>
      </form>
    </FormProvider>
  );
};

import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Recipe } from "@/types/recipe";
import { useUpdateRecipe } from "@/hooks";
import { editRecipeSchema, type EditRecipeFormData } from "@/schemas/recipe";
import { inputClassName } from "@/components/ui/input-cursor";
import { cn } from "@/lib/utils";
import { RHFInput } from "../rhf";

type EditRecipeFormProps = {
  recipe: Recipe;
  onSuccess: () => void;
};

export const EditRecipeForm = ({ recipe, onSuccess }: EditRecipeFormProps) => {
  const updateRecipe = useUpdateRecipe();

  const form = useForm<EditRecipeFormData>({
    resolver: zodResolver(editRecipeSchema),
    defaultValues: {
      name: recipe.name,
      description: recipe.description,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  const submitHandler: SubmitHandler<EditRecipeFormData> = (data) => {
    updateRecipe.mutate(
      {
        id: recipe.id,
        payload: { name: data.name, description: data.description },
      },
      { onSuccess: () => onSuccess() },
    );
  };

  const isPending = updateRecipe.isPending || isSubmitting;

  return (
    <FormProvider {...form}>
      <form id="edit-recipe-form" onSubmit={form.handleSubmit(submitHandler)} className="grid gap-4">
        <RHFInput<EditRecipeFormData> name="name" label="Name" helpText="Recipe name" />
        <div className="grid gap-2">
          <label htmlFor="edit-recipe-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="edit-recipe-description"
            rows={3}
            {...register("description")}
            className={cn(inputClassName, "min-h-20 py-2")}
            placeholder="Short description"
            disabled={isPending}
          />
          {errors.description ? <p className="text-destructive text-sm">{errors.description.message}</p> : null}
        </div>
      </form>
    </FormProvider>
  );
};

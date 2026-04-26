import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Recipe } from "@/types/recipe";
import { editRecipeSchema, type EditRecipeFormData } from "@/schemas/recipe";
import { inputClassName } from "@/components/ui/input-cursor";
import { cn } from "@/lib/utils";
import { RHFInput } from "../rhf";

type EditRecipeFormProps = {
  recipe: Recipe;
  onSubmit: SubmitHandler<EditRecipeFormData>;
  isSaving?: boolean;
};

export const EditRecipeForm = ({ recipe, onSubmit, isSaving = false }: EditRecipeFormProps) => {
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
    formState: { errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form id="edit-recipe-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <fieldset disabled={isSaving} className="contents">
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
            />
            {errors.description ? <p className="text-destructive text-sm">{errors.description.message}</p> : null}
          </div>
        </fieldset>
      </form>
    </FormProvider>
  );
};

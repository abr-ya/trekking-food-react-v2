import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "lucide-react";

import type { Recipe } from "@/types/recipe";
import { useRecipeCategories, useUpdateRecipe } from "@/hooks";
import { editRecipeCategorySchema, type EditRecipeCategoryFormData } from "@/schemas/recipe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RHFStaticSelect } from "@/components/rhf";

type Props = { recipe: Recipe };

export const EditRecipeCategoryDialog = ({ recipe }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useRecipeCategories();
  const categoryOptions = useMemo(
    () => (categoriesData?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    [categoriesData?.data],
  );

  const updateRecipe = useUpdateRecipe();

  const form = useForm<EditRecipeCategoryFormData>({
    resolver: zodResolver(editRecipeCategorySchema),
    defaultValues: { categoryId: recipe.categoryId },
  });

  const handleClose = () => {
    setIsOpen(false);
    form.reset({ categoryId: recipe.categoryId });
  };

  const onSubmit = (data: EditRecipeCategoryFormData) => {
    updateRecipe.mutate(
      { id: recipe.id, payload: { categoryId: data.categoryId } },
      { onSuccess: handleClose },
    );
  };

  const hasCategory = Boolean(recipe.category);

  return (
    <>
      {hasCategory ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-5 text-muted-foreground hover:text-foreground [&_svg]:size-3"
          aria-label="Edit category"
          onClick={() => setIsOpen(true)}
        >
          <Tag />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-6 gap-1 px-2 text-xs"
          onClick={() => setIsOpen(true)}
        >
          <Tag className="size-3" />
          Set category
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>Change the category for {recipe.name}.</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form id="edit-recipe-category-form" onSubmit={form.handleSubmit(onSubmit)}>
              {categoriesLoading ? (
                <p className="text-muted-foreground text-sm">Loading recipe categories…</p>
              ) : categoriesError ? (
                <p className="text-destructive text-sm">
                  Failed to load recipe categories
                  {categoriesError instanceof Error ? `: ${categoriesError.message}` : ""}.
                </p>
              ) : categoryOptions.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No recipe categories yet. Add one on the Categories page.
                </p>
              ) : (
                <RHFStaticSelect<EditRecipeCategoryFormData>
                  name="categoryId"
                  label="Recipe category"
                  options={categoryOptions}
                  placeholder="Select a recipe category"
                />
              )}
            </form>
          </FormProvider>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-recipe-category-form"
              disabled={updateRecipe.isPending || categoryOptions.length === 0}
            >
              {updateRecipe.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

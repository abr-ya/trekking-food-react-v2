import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateProductCategory,
  useCreateRecipeCategory,
  useUpdateProductCategory,
  useUpdateRecipeCategory,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RHFInput } from "@/components/rhf";
import { categoryNameSchema, type CategoryNameFormData } from "@/schemas/category-name";
import type { CategoryKind } from "@/types/category";

export type CategoryDialogProps = {
  kind: CategoryKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, dialog edits this category (name only). */
  initialCategory?: { id: string; name: string } | null;
};

const titles: Record<CategoryKind, { create: string; edit: string }> = {
  product: {
    create: "New product category",
    edit: "Edit product category",
  },
  recipe: {
    create: "New recipe category",
    edit: "Edit recipe category",
  },
};

export function CategoryDialog({ kind, open, onOpenChange, initialCategory = null }: CategoryDialogProps) {
  const isEdit = initialCategory != null;

  const createProduct = useCreateProductCategory();
  const updateProduct = useUpdateProductCategory();
  const createRecipe = useCreateRecipeCategory();
  const updateRecipe = useUpdateRecipeCategory();

  const form = useForm<CategoryNameFormData>({
    resolver: zodResolver(categoryNameSchema),
    defaultValues: { name: "" },
    mode: "onSubmit",
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset({ name: initialCategory?.name ?? "" });
    }
  }, [open, initialCategory?.id, initialCategory?.name, reset]);

  const saving =
    kind === "product"
      ? isEdit
        ? updateProduct.isPending
        : createProduct.isPending
      : isEdit
        ? updateRecipe.isPending
        : createRecipe.isPending;

  const onSubmit = handleSubmit(async (data) => {
    if (kind === "product") {
      if (isEdit && initialCategory) {
        await updateProduct.mutateAsync({ id: initialCategory.id, name: data.name.trim() });
      } else {
        await createProduct.mutateAsync({ name: data.name.trim() });
      }
    } else if (isEdit && initialCategory) {
      await updateRecipe.mutateAsync({ id: initialCategory.id, name: data.name.trim() });
    } else {
      await createRecipe.mutateAsync({ name: data.name.trim() });
    }
    onOpenChange(false);
  });

  const label = titles[kind];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? label.edit : label.create}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the category name. Other fields are not editable here."
              : "Enter a name for the new category."}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="grid gap-4" noValidate>
            <RHFInput<CategoryNameFormData>
              name="name"
              label="Name"
              type="text"
              autoComplete="off"
              placeholder="Category name"
              id={`category-name-${kind}`}
            />
            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : isEdit ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

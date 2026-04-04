import { useState } from "react";
import { Trash2 } from "lucide-react";

import { useDeleteProductCategory, useDeleteRecipeCategory } from "@/hooks";
import type { CategoryKind } from "@/types/category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  categoryId: string;
  name: string;
  kind: CategoryKind;
};

export const DeleteCategoryDialog = ({ categoryId, name, kind }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteProductCategory = useDeleteProductCategory();
  const deleteRecipeCategory = useDeleteRecipeCategory();

  const handleClose = () => setIsOpen(false);

  const handleDelete = () => {
    const mutate = kind === "product" ? deleteProductCategory : deleteRecipeCategory;
    mutate.mutate(categoryId, { onSuccess: handleClose });
  };

  const mutate = kind === "product" ? deleteProductCategory : deleteRecipeCategory;
  const isPending = mutate.isPending;
  const label = kind === "product" ? "product" : "recipe";

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 text-muted-foreground hover:text-destructive [&_svg]:size-3.5"
        aria-label={`Delete ${name}`}
        onClick={() => setIsOpen(true)}
      >
        <Trash2 />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Delete {label} category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium text-foreground">{name}</span>? Associated{" "}
              {label === "product" ? "products" : "recipes"} will remain without a category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

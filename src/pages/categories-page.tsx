import { useState } from "react";
import { CategoriesList, ColumnsWrapper, PageColumn } from "@/components";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/dialogs/category-dialog";
import type { ProductCategory } from "@/types/category";

export const CategoriesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (category: ProductCategory) => {
    setEditing({ id: category.id, name: category.name });
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditing(null);
    }
  };

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Categories</h1>
      <ColumnsWrapper>
        <PageColumn title="Product categories" description="Categories from the API (GET /product-categories).">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" size="sm" onClick={openCreate}>
              New category
            </Button>
          </div>
          <div className="mt-3">
            <CategoriesList onEditCategory={openEdit} />
          </div>
        </PageColumn>
      </ColumnsWrapper>
      <CategoryDialog
        kind="product"
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        initialCategory={editing}
      />
    </div>
  );
};

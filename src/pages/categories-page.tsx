import { useState } from "react";
import { CategoriesList, ColumnsWrapper, PageColumn, type CategoryListEditPayload } from "@/components";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/dialogs/category-dialog";
import type { CategoryKind } from "@/types/category";

export const CategoriesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKind, setDialogKind] = useState<CategoryKind>("product");
  const [editing, setEditing] = useState<CategoryListEditPayload | null>(null);

  const openCreate = (kind: CategoryKind) => {
    setDialogKind(kind);
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (kind: CategoryKind) => (category: CategoryListEditPayload) => {
    setDialogKind(kind);
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
            <Button type="button" size="sm" onClick={() => openCreate("product")}>
              New product category
            </Button>
          </div>
          <div className="mt-3">
            <CategoriesList kind="product" onEditCategory={openEdit("product")} />
          </div>
        </PageColumn>
        <PageColumn title="Recipe categories" description="Categories from the API (GET /recipe-categories).">
          todo: add recipe categories
        </PageColumn>
      </ColumnsWrapper>
      <CategoryDialog
        kind={dialogKind}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        initialCategory={editing}
      />
    </div>
  );
};

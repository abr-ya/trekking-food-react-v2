import { useState } from "react";
import { ColumnsWrapper, PageColumn } from "@/components";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/dialogs/category-dialog";

export const RecipesPage = () => {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Recipes</h1>
      <ColumnsWrapper>
        <PageColumn title="Recipes list">
          <p>Recipes list</p>
        </PageColumn>
        <PageColumn title="Create recipe" description="Add a recipe or manage recipe categories.">
          <p>Create recipe</p>
          <div className="mt-6 border-t pt-4">
            <h3 className="mb-2 text-sm font-semibold">Recipe categories</h3>
            <p className="text-muted-foreground mb-3 text-sm">POST /recipe-categories</p>
            <Button type="button" size="sm" onClick={() => setCategoryDialogOpen(true)}>
              New recipe category
            </Button>
          </div>
        </PageColumn>
      </ColumnsWrapper>
      <CategoryDialog kind="recipe" open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
    </div>
  );
};

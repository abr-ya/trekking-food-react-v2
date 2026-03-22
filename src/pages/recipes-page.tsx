import { useState } from "react";
import { CategoryDialog, ColumnsWrapper, CreateRecipeForm, PageColumn, ProtectedPage, RecipesList } from "@/components";
import { Button } from "@/components/ui/button";

export const RecipesPage = () => {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  return (
    <ProtectedPage title="Recipes">
      <ColumnsWrapper>
        <PageColumn title="Recipes list">
          <RecipesList />
        </PageColumn>
        <PageColumn title="Create recipe" description="Create a new recipe (POST /recipes).">
          <CreateRecipeForm />
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
    </ProtectedPage>
  );
};

import { useState } from "react";
import { CategoryDialog, ColumnsWrapper, CreateRecipeForm, PageColumn } from "@/components";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export const RecipesPage = () => {
  const { isAuthenticated } = useAuth();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Recipes</h1>
      {isAuthenticated ? (
        <ColumnsWrapper>
          <PageColumn title="Recipes list">
            <p>Recipes list</p>
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
      ) : (
        <div>
          <h2 className="text-lg font-bold">You are not authenticated</h2>
          <p className="text-sm text-muted-foreground">Please login to view this page.</p>
        </div>
      )}
      <CategoryDialog kind="recipe" open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
    </div>
  );
};

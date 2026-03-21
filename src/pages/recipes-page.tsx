import { ColumnsWrapper, PageColumn } from "@/components";

export const RecipesPage = () => (
  <div className="space-y-2">
    <h1 className="text-xl font-bold">Recipes</h1>
    <ColumnsWrapper>
      <PageColumn title="Recipes list">
        <p>Recipes list</p>
      </PageColumn>
      <PageColumn title="Create recipe">
        <p>Create recipe</p>
      </PageColumn>
    </ColumnsWrapper>
  </div>
);

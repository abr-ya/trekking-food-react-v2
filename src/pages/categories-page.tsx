import { CategoriesList, ColumnsWrapper, PageColumn } from "@/components";

export const CategoriesPage = () => (
  <div className="space-y-2">
    <h1 className="text-xl font-bold">Categories</h1>
    <ColumnsWrapper>
      <PageColumn title="Product categories" description="Categories from the API (GET /product-categories).">
        <CategoriesList />
      </PageColumn>
    </ColumnsWrapper>
  </div>
);

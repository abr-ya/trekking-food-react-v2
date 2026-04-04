import { useProductCategories, useRecipeCategories } from "@/hooks";
import type { CategoryKind } from "@/types/category";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "./category-card";
import { DeleteCategoryDialog } from "../dialogs/delete-category-dialog";

export type CategoryListEditPayload = {
  id: string;
  name: string;
};

type CategoriesListProps = {
  kind: CategoryKind;
  onEditCategory?: (category: CategoryListEditPayload) => void;
};

function LoadingSkeletons() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

function ErrorMessage({ error }: { error: unknown }) {
  return (
    <p className="text-destructive text-sm">
      Failed to load categories: {error instanceof Error ? error.message : "Unknown error"}
    </p>
  );
}

export const CategoriesList = ({ kind, onEditCategory }: CategoriesListProps) => {
  const productQuery = useProductCategories();
  const recipeQuery = useRecipeCategories();

  if (kind === "product") {
    const { data, isLoading, error } = productQuery;
    const categories = data?.data;

    if (isLoading) return <LoadingSkeletons />;
    if (error) return <ErrorMessage error={error} />;
    if (!categories?.length) {
      return <p className="text-muted-foreground text-sm">No categories returned from the API.</p>;
    }

    return (
      <div className="space-y-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            itemCount={category.products.length}
            kind="product"
            onEdit={onEditCategory != null ? () => onEditCategory({ id: category.id, name: category.name }) : undefined}
            deleteDialog={<DeleteCategoryDialog categoryId={category.id} name={category.name} kind="product" />}
          />
        ))}
      </div>
    );
  }

  const { data, isLoading, error } = recipeQuery;
  const categories = data?.data;

  if (isLoading) return <LoadingSkeletons />;
  if (error) return <ErrorMessage error={error} />;
  if (!categories?.length) {
    return <p className="text-muted-foreground text-sm">No categories returned from the API.</p>;
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          name={category.name}
          itemCount={category.recipes.length}
          kind="recipe"
          onEdit={onEditCategory != null ? () => onEditCategory({ id: category.id, name: category.name }) : undefined}
          deleteDialog={<DeleteCategoryDialog categoryId={category.id} name={category.name} kind="recipe" />}
        />
      ))}
    </div>
  );
};

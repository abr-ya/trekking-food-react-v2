import { useProductCategories } from "@/hooks";
import type { ProductCategory } from "@/types/category";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "./category-card";

type CategoriesListProps = {
  onEditCategory?: (category: ProductCategory) => void;
};

export const CategoriesList = ({ onEditCategory }: CategoriesListProps) => {
  const { data, isLoading, error } = useProductCategories();
  const categories = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load categories: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!categories?.length) {
    return <p className="text-muted-foreground text-sm">No categories returned from the API.</p>;
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} onEdit={onEditCategory} />
      ))}
    </div>
  );
};

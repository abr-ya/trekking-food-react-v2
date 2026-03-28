import { useState } from "react";

import { useProducts, useProductCategories } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiCategoryFilter } from "@/components/common/MultiCategoryFilter";
import { ProductCard } from "./product-card";

export const ProductsList = () => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const { data: categoriesData, isLoading: categoriesLoading } = useProductCategories();
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, error } = useProducts(
    selectedCategoryIds.length ? { categoryId: selectedCategoryIds } : {},
  );
  const products = data?.data;
  const meta = data?.meta;

  return (
    <div className="space-y-3">
      <MultiCategoryFilter
        value={selectedCategoryIds}
        onChange={setSelectedCategoryIds}
        options={categories}
        isLoading={categoriesLoading}
      />

      <div className="overflow-y-auto max-h-[60vh] pr-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">
            Failed to load products: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        ) : !products?.length ? (
          <p className="text-muted-foreground text-sm">No products yet. Create one to get started.</p>
        ) : (
          <ul className="space-y-2 list-none p-0 m-0">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {meta != null && (
        <p className="text-muted-foreground text-xs">
          Page {meta.page} of {meta.totalPages} · {meta.total} total · {meta.limit} per page
        </p>
      )}
    </div>
  );
};

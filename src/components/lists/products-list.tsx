import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { useProducts, useProductCategories } from "@/hooks";
import { Input, MultiCategoryFilter, Pagination, Skeleton } from "@/components";
import { ProductCard } from "./product-card";

const PRODUCTS_PAGE_SIZE = 20;

export const ProductsList = () => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Clear search when category filter changes
  useEffect(() => {
    setSearch("");
  }, [selectedCategoryIds]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategoryIds]);

  const { data: categoriesData, isLoading: categoriesLoading } = useProductCategories();
  const categories = categoriesData?.data ?? [];

  const params = {
    page,
    limit: PRODUCTS_PAGE_SIZE,
    ...(selectedCategoryIds.length ? { categoryId: selectedCategoryIds } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };
  const { data, isLoading, isFetching, error, isPlaceholderData } = useProducts(params);
  const products = data?.data;
  const meta = data?.meta;
  const showFetchOverlay = isFetching && !isLoading;

  return (
    <div className="space-y-3">
      <MultiCategoryFilter
        value={selectedCategoryIds}
        onChange={setSelectedCategoryIds}
        options={categories}
        isLoading={categoriesLoading}
      />

      <Input
        type="search"
        placeholder="Search products by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="relative overflow-y-auto max-h-[54vh] pr-1 min-h-[12rem]">
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
        ) : !products?.length && !isPlaceholderData ? (
          <p className="text-muted-foreground text-sm">No products yet. Create one to get started.</p>
        ) : (
          <>
            {products?.length ? (
              <ul className="space-y-2 list-none p-0 m-0">
                {products.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No products on this page.</p>
            )}
            {showFetchOverlay ? (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/55 backdrop-blur-[1px]"
                aria-hidden
              >
                <Loader2 className="size-8 shrink-0 animate-spin text-muted-foreground" aria-label="Loading" />
              </div>
            ) : null}
          </>
        )}
      </div>

      {meta != null && meta.totalPages <= 1 && (
        <p className="text-muted-foreground text-xs">
          {meta.total} {meta.total === 1 ? "product" : "products"}
          {meta.limit ? ` · ${meta.limit} per page` : null}
        </p>
      )}

      {meta != null && meta.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          disabled={isFetching}
          totalItems={meta.total}
        />
      )}
    </div>
  );
};

import { useProducts } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";

export const ProductsList = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Failed to load products: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!products?.length) {
    return <p className="text-muted-foreground text-sm">No products yet. Create one to get started.</p>;
  }

  return (
    <ul className="space-y-2 list-none p-0 m-0">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
};

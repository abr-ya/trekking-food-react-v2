import type { Product } from "@/types/product";
import { Card, CardContent, EditProductCategoryDialog, EditProductDialog, RemoveProductDialog } from "@/components";

export const ProductCard = ({ product }: { product: Product }) => (
  <Card className="py-3 px-4">
    <CardContent className="flex flex-wrap items-center justify-between gap-2 p-0">
      <div className="min-w-0">
        <p className="font-medium truncate xl:overflow-visible xl:whitespace-normal xl:text-clip max-w-[16rem] xl:max-w-none">
          {product.name}
        </p>
        <p className="text-muted-foreground text-sm">
          {product.kkal} kcal · P: {product.proteins}g · F: {product.fats}g · C: {product.carbohydrates}g
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {product.category && (
          <div className="flex items-center gap-0.5">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {product.category.name}
            </span>
            <EditProductCategoryDialog product={product} />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {product.isVegetarian && (
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              Veg
            </span>
          )}
          <span className="font-semibold">{product.price.toFixed(2)}</span>
          <div className="flex items-center gap-0.5">
            <EditProductDialog product={product} />
            <RemoveProductDialog itemId={product.id} itemName={product.name} />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

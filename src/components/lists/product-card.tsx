import type { Product } from "@/types/product";
import { Card, CardContent, EditProductCategoryDialog, EditProductDialog, RemoveProductDialog } from "@/components";

export const ProductCard = ({ product, categoryName }: { product: Product; categoryName?: string }) => (
  <Card className="py-3 px-4">
    <CardContent className="flex flex-wrap items-center justify-between gap-2 p-0">
      <div>
        <p className="font-medium">{product.name}</p>
        <p className="text-muted-foreground text-sm">
          {product.kkal} kcal · P: {product.proteins}g · F: {product.fats}g · C: {product.carbohydrates}g
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {categoryName && (
          <div className="flex items-center gap-0.5">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{categoryName}</span>
            <EditProductCategoryDialog product={product} />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span className="font-semibold">{product.price.toFixed(2)}</span>
          {product.isVegetarian && (
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              Veg
            </span>
          )}
          <div className="flex items-center gap-0.5">
            <EditProductDialog product={product} />
            <RemoveProductDialog itemId={product.id} itemName={product.name} />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

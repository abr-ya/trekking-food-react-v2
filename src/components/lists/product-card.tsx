import type { Product } from "@/types/product";
import { Card, CardContent } from "../ui/card";

export const ProductCard = ({ product }: { product: Product }) => (
  <Card className="py-3 px-4">
    <CardContent className="p-0 flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="font-medium">{product.name}</p>
        <p className="text-muted-foreground text-sm">
          {product.kkal} kcal · P: {product.proteins}g · F: {product.fats}g · C: {product.carbohydrates}g
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">${product.price.toFixed(2)}</span>
        {product.isVegetarian && (
          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
            Veg
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

import type { ProductCategory } from "@/types/category";
import { Card, CardContent } from "../ui/card";

export const CategoryCard = ({ category }: { category: ProductCategory }) => (
  <Card className="py-3 px-4">
    <CardContent className="p-0">
      <p className="font-medium">{category.name}</p>
      <p className="text-muted-foreground text-sm">
        {category.products.length === 0
          ? "No products in this category"
          : `${category.products.length} product${category.products.length === 1 ? "" : "s"}`}
      </p>
    </CardContent>
  </Card>
);

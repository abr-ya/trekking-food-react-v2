import { Pencil } from "lucide-react";
import type { ProductCategory } from "@/types/category";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type CategoryCardProps = {
  category: ProductCategory;
  onEdit?: (category: ProductCategory) => void;
};

export const CategoryCard = ({ category, onEdit }: CategoryCardProps) => (
  <Card className="py-3 px-4">
    <CardContent className="flex flex-wrap items-start justify-between gap-2 p-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{category.name}</p>
        <p className="text-muted-foreground text-sm">
          {category.products.length === 0
            ? "No products in this category"
            : `${category.products.length} product${category.products.length === 1 ? "" : "s"}`}
        </p>
      </div>
      {onEdit != null ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 shrink-0 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
          aria-label={`Edit ${category.name}`}
          onClick={() => onEdit(category)}
        >
          <Pencil />
        </Button>
      ) : null}
    </CardContent>
  </Card>
);

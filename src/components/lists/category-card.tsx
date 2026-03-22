import { Pencil } from "lucide-react";
import type { CategoryKind } from "@/types/category";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type CategoryCardProps = {
  name: string;
  itemCount: number;
  kind: CategoryKind;
  onEdit?: () => void;
};

const itemSummary = (count: number, kind: CategoryKind): string => {
  const singular = kind === "product" ? "product" : "recipe";
  const plural = kind === "product" ? "products" : "recipes";
  if (count === 0) {
    return `No ${plural} in this category`;
  }
  return `${count} ${count === 1 ? singular : plural}`;
};

export const CategoryCard = ({ name, itemCount, kind, onEdit }: CategoryCardProps) => (
  <Card className="py-3 px-4">
    <CardContent className="flex flex-wrap items-start justify-between gap-2 p-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground text-sm">{itemSummary(itemCount, kind)}</p>
      </div>
      {onEdit != null ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 shrink-0 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
          aria-label={`Edit ${name}`}
          onClick={onEdit}
        >
          <Pencil />
        </Button>
      ) : null}
    </CardContent>
  </Card>
);

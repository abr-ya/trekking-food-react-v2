import { useHikingProductTotals } from "@/hooks";

type ShoppingListProps = {
  hikingId: string;
};

export const ShoppingList = ({ hikingId }: ShoppingListProps) => {
  const { data, isLoading } = useHikingProductTotals(hikingId);
  const items = data?.items ?? [];

  console.log(items);

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading shopping list…</p>;
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No items in shopping list.</p>;
  }

  return <p className="text-muted-foreground text-sm">Shopping list content will be added here.</p>;
};

import { useHikingProductTotals } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

type ShoppingListProps = {
  hikingId: string;
};

export const ShoppingList = ({ hikingId }: ShoppingListProps) => {
  const { data, isLoading } = useHikingProductTotals(hikingId);
  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="rounded-md border p-4">
        <div className="space-y-3">
          <Skeleton className="h-9 w-full" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">No items in shopping list.</p>;
  }

  const totalWeight = items.reduce((sum, item) => sum + item.totalGrams, 0);

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-2 text-left font-medium">#</th>
            <th className="px-4 py-2 text-left font-medium">Product</th>
            <th className="px-4 py-2 text-right font-medium">Total (g)</th>
            <th className="px-4 py-2 text-right font-medium">Uses</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.productId} className="border-b last:border-b-0">
              <td className="px-4 py-2 text-muted-foreground">{index + 1}</td>
              <td className="px-4 py-2">{item.productName}</td>
              <td className="px-4 py-2 text-right">{item.totalGrams}</td>
              <td className="px-4 py-2 text-right">{item.lineCount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t bg-muted/30 font-medium">
            <td className="px-4 py-2" colSpan={2}>
              Total
            </td>
            <td className="px-4 py-2 text-right">{totalWeight}</td>
            <td className="px-4 py-2 text-right">{items.reduce((sum, item) => sum + item.lineCount, 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

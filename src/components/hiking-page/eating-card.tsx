import type { HikingProduct } from "@/types/hiking-product";
import { cn } from "@/lib/utils";

type EatingCardProps = {
  items: HikingProduct[];
};

export const EatingCard = ({ items }: EatingCardProps) => {
  const recipeName = items[0].recipe_name;

  return (
    <div className={cn("rounded-md border border-border/80 bg-muted/40 px-2.5 py-2 text-sm", "flex flex-col gap-1")}>
      <span className="font-medium leading-tight">{recipeName}</span>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs leading-snug">{item.product_name}</span>
            <span className="text-muted-foreground tabular-nums text-xs">
              Personal {item.personal_quantity} · Total {item.total_quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

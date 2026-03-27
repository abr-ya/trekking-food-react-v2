import { Pencil, Trash2 } from "lucide-react";

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
          <div key={item.id} className="flex items-start justify-between gap-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs leading-snug">{item.product_name}</span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground tabular-nums text-xs">
                  Personal {item.personal_quantity} · Total {item.total_quantity}
                </span>
                <button
                  type="button"
                  onClick={() => console.log("edit hiking product", item.id)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  aria-label={`Edit quantities for ${item.product_name}`}
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => console.log("delete hiking product", item.id)}
              className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0 cursor-pointer transition-colors"
              aria-label={`Delete ${item.product_name}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

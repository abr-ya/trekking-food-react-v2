import type { HikingProduct } from "@/types/hiking-product";
import { cn } from "@/lib/utils";

type EatingCardProps = {
  data: HikingProduct;
  membersTotal: number;
};

export const EatingCard = ({ data, membersTotal }: EatingCardProps) => (
  <div
    className={cn(
      "rounded-md border border-border/80 bg-muted/40 px-2.5 py-2 text-sm",
      "flex flex-col gap-1",
    )}
  >
    <span className="font-medium leading-tight">{data.recipe_name}</span>
    <span className="text-muted-foreground text-xs leading-snug">{data.product_name}</span>
    <span className="text-muted-foreground tabular-nums text-xs">
      Personal {data.personal_quantity} · Total {data.total_quantity}
    </span>
    <span className="text-muted-foreground text-xs">Group size: {membersTotal} people</span>
  </div>
);

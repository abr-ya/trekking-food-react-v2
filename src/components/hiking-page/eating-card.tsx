import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useDeleteHikingProduct } from "@/hooks";
import type { HikingProduct } from "@/types/hiking-product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EatingCardProps = {
  hikingId: string;
  items: HikingProduct[];
};

export const EatingCard = ({ hikingId, items }: EatingCardProps) => {
  const recipeName = items[0].recipe_name;
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { mutate: deleteProduct, isPending } = useDeleteHikingProduct();

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteProduct({ hikingId, hikingProductId: pendingDeleteId }, { onSuccess: () => setPendingDeleteId(null) });
  };

  const pendingItem = items.find((p) => p.id === pendingDeleteId);

  return (
    <>
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
                    <Pencil className="size-2.5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingDeleteId(item.id)}
                className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0 cursor-pointer transition-colors"
                aria-label={`Delete ${item.product_name}`}
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              Remove <span className="font-medium text-foreground">{pendingItem?.product_name}</span> from this eating
              slot? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingDeleteId(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete} disabled={isPending}>
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

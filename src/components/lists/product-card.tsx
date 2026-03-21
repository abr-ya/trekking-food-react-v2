import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteProduct } from "@/hooks";
import type { Product } from "@/types/product";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export const ProductCard = ({ product }: { product: Product }) => {
  const [removeOpen, setRemoveOpen] = useState(false);
  const deleteProduct = useDeleteProduct();

  const handleConfirmRemove = () => {
    deleteProduct.mutate(product.id, {
      onSuccess: () => setRemoveOpen(false),
    });
  };

  return (
    <Card className="py-3 px-4">
      <CardContent className="flex flex-wrap items-center justify-between gap-2 p-0">
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-muted-foreground text-sm">
            {product.kkal} kcal · P: {product.proteins}g · F: {product.fats}g · C: {product.carbohydrates}g
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          {product.isVegetarian && (
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              Veg
            </span>
          )}
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
              aria-label={`Edit ${product.name}`}
              onClick={() => console.log("edit", product.id, product.name)}
            >
              <Pencil />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 text-muted-foreground hover:text-destructive [&_svg]:size-3.5"
              aria-label={`Remove ${product.name}`}
              onClick={() => setRemoveOpen(true)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Remove this product?</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to remove "${product.name}"? This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRemoveOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteProduct.isPending}
              onClick={handleConfirmRemove}
            >
              {deleteProduct.isPending ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

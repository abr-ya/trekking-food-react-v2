import { useDeleteProduct } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export type RemoveProductDialogProps = {
  itemId: string;
  itemName: string;
};

export const RemoveProductDialog = ({ itemId, itemName }: RemoveProductDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteProduct = useDeleteProduct();

  const handleConfirm = () => {
    deleteProduct.mutate(itemId, {
      onSuccess: () => setIsOpen(false),
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-7 text-muted-foreground hover:text-destructive [&_svg]:size-3.5"
        aria-label={`Remove ${itemName}`}
        onClick={() => setIsOpen(true)}
      >
        <Trash2 />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Remove this product?</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to remove "${itemName}"? This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={deleteProduct.isPending} onClick={handleConfirm}>
              {deleteProduct.isPending ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

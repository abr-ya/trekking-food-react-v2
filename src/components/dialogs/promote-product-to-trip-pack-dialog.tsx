import { useState } from "react";
import { Package } from "lucide-react";

import { usePromoteToTripPack } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type PromoteProductToTripPackDialogProps = {
  hikingId: string;
  productId: string;
  productName: string;
};

export const PromoteProductToTripPackDialog = ({
  hikingId,
  productId,
  productName,
}: PromoteProductToTripPackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending, isError, error, reset } = usePromoteToTripPack();

  const handleConfirm = () => {
    mutate(
      { hikingId, payload: { productId } },
      {
        onSuccess: () => {
          setIsOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setIsOpen(true)}>
        <Package className="mr-1.5 size-3.5" />
        To trip pack
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) reset();
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Move to trip pack?</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to move "${productName}" into the trip pack?`}
            </DialogDescription>
          </DialogHeader>
          {isError ? (
            <p className="text-destructive text-sm">{error instanceof Error ? error.message : "Request failed."}</p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="button" disabled={isPending} onClick={handleConfirm}>
              {isPending ? "Moving…" : "Move"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

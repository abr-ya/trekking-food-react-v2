import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { useAutoDistributePacks } from "@/hooks";
import type { HikingDetail } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toastError, toastSuccess } from "@/lib/toast";

type AutoDistributeButtonProps = {
  hikingId: string;
  dayNumber: number;
  unassignedCount: number;
  onDistribute: (data: HikingDetail) => void;
};

export const AutoDistributeButton = ({
  hikingId,
  dayNumber,
  unassignedCount,
  onDistribute,
}: AutoDistributeButtonProps) => {
  const [open, setOpen] = useState(false);
  const autoDistribute = useAutoDistributePacks();

  const handleDistribute = () => {
    autoDistribute.mutate(
      { hikingId, payload: { dayNumber } },
      {
        onSuccess: (data) => {
          setOpen(false);
          onDistribute(data);
          // todo: coommon success handling for api calls !!!
          toastSuccess(`Packs auto-distributed for Day ${dayNumber}`);
        },
        // todo: it's needed? coommom error handling for api calls !!!
        onError: (err) => {
          toastError(`Failed to auto-distribute packs: ${err instanceof Error ? err.message : "Unknown error"}`);
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={autoDistribute.isPending || unassignedCount === 0}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {autoDistribute.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {autoDistribute.isPending ? "Distributing…" : "Auto-distribute"}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Auto-distribute Day {dayNumber}
            </DialogTitle>
            <DialogDescription>
              This will reset all packs for this day and redistribute products automatically. Any manual changes you
              made will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border bg-background hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDistribute}
              disabled={autoDistribute.isPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {autoDistribute.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {autoDistribute.isPending ? "Distributing…" : "OK, Distribute"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

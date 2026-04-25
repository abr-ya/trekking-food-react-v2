import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  /** When set, shown in the center line (e.g. total item count from API meta). */
  totalItems?: number;
};

/**
 * Reusable list pagination: prev/next and “Page x of y” (and optional total count).
 * Parent owns `page` and passes it into the data hook together with `limit`.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled,
  className,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const atFirst = page <= 1;
  const atLast = page >= totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-center gap-3 sm:justify-between", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || atFirst}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <p className="text-muted-foreground order-first w-full text-center text-xs sm:order-none sm:w-auto">
        Page {page} of {totalPages}
        {totalItems != null ? ` · ${totalItems} total` : null}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || atLast}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type AddRecipeSlotPositionBy = {
  hikingId: string;
  dayNumber: number;
  eatingTimeId: string;
};

type AddFooterProps = {
  position: AddRecipeSlotPositionBy;
};

/** Footer action per meal slot; wire to add-recipe flow or dialog as needed. */
export function AddFooter({ position }: AddFooterProps) {
  return (
    <CardFooter className="mt-auto border-t pt-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => console.log("Add recipe to slot", position)}
      >
        Add recipe
      </Button>
    </CardFooter>
  );
}

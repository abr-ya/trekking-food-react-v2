import { AddProductToHikingDialog, AddRecipeToHikingDialog, CardFooter } from "@/components";

export type AddRecipeSlotPositionBy = {
  hikingId: string;
  dayNumber: number;
  eatingTimeId: string;
};

type AddFooterProps = {
  position: AddRecipeSlotPositionBy;
};

/** Footer action per meal slot. */
export const AddFooter = ({ position }: AddFooterProps) => (
  <CardFooter className="mt-auto border-t pt-4 flex-col gap-2">
    <AddRecipeToHikingDialog
      hikingId={position.hikingId}
      dayNumber={position.dayNumber}
      eatingTimeId={position.eatingTimeId}
    />

    <AddProductToHikingDialog
      hikingId={position.hikingId}
      dayNumber={position.dayNumber}
      eatingTimeId={position.eatingTimeId}
    />
  </CardFooter>
);

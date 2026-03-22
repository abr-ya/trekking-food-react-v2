import type { Hiking } from "@/types/hiking";
import { Card, CardContent } from "@/components";

export const HikingCard = ({ hiking }: { hiking: Hiking }) => {
  return (
    <Card className="py-3 px-4">
      <CardContent className="p-0">
        <p className="font-medium">{hiking.name}</p>
        <p className="text-muted-foreground text-sm">
          {hiking.daysTotal} days · {hiking.membersTotal} people · {hiking.vegetariansTotal} vegetarian
          {hiking.vegetariansTotal === 1 ? "" : "s"}
        </p>
      </CardContent>
    </Card>
  );
};

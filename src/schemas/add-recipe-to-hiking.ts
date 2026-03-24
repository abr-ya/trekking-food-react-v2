import { z } from "zod";

export const createAddRecipeToHikingSchema = (daysTotal: number) =>
  z.object({
    recipeId: z.string().min(1, "Recipe is required"),
    dayNumber: z
      .number({ error: "Day is required" })
      .int()
      .min(1, "Day must be at least 1")
      .max(daysTotal, `Day cannot exceed ${daysTotal}`),
    eatingTimeId: z.string().min(1, "Eating time is required"),
  });

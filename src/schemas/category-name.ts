import { z } from "zod";

export const categoryNameSchema = z.object({
  name: z.string().trim().min(3, "Name is required (at least 3 characters)"),
});

export type CategoryNameFormData = z.infer<typeof categoryNameSchema>;

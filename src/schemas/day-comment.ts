import { z } from "zod";

export const dayCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(500, "Comment must be at most 500 characters"),
  dayNumber: z.number().int().min(1),
});

export type DayCommentFormData = z.infer<typeof dayCommentSchema>;

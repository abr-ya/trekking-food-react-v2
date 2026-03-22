import { z } from "zod";

export const createHikingSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    daysTotal: z.number().int().min(1, "At least 1 day"),
    membersTotal: z.number().int().min(1, "At least 1 member"),
    vegetariansTotal: z.number().int().min(0, "Must be 0 or more"),
  })
  .superRefine((data, ctx) => {
    if (data.vegetariansTotal > data.membersTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot exceed group size",
        path: ["vegetariansTotal"],
      });
    }
  });

export type CreateHikingFormData = z.infer<typeof createHikingSchema>;

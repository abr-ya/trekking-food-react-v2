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

/** Validates group size when editing via PATCH /hikings/:id/members-total. */
export const createUpdateMembersTotalSchema = (vegetariansTotal: number) =>
  z
    .object({
      membersTotal: z.number().int().min(1, "At least 1 member"),
    })
    .superRefine((data, ctx) => {
      if (data.membersTotal < vegetariansTotal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cannot be less than vegetarians count",
          path: ["membersTotal"],
        });
      }
    });

export type UpdateMembersTotalFormData = z.infer<ReturnType<typeof createUpdateMembersTotalSchema>>;

import { z } from "zod";

const productOptionSchema = z.object({ label: z.string(), value: z.string().min(1) }).nullable();

export const addProductToHikingSchema = z
  .object({
    product: productOptionSchema,
    personalQuantity: z.number({ error: "Required" }).int().positive("Must be > 0"),
    totalQuantity: z.number({ error: "Required" }).int().nonnegative("Must be ≥ 0"),
  })
  .superRefine((data, ctx) => {
    if (data.product === null) {
      ctx.addIssue({ code: "custom", message: "Product is required", path: ["product"] });
    }
    if (data.totalQuantity !== 0 && data.totalQuantity <= data.personalQuantity) {
      ctx.addIssue({
        code: "custom",
        message: "Total quantity must be greater than personal quantity (or 0)",
        path: ["totalQuantity"],
      });
    }
  });

export type AddProductToHikingFormData = z.infer<typeof addProductToHikingSchema>;

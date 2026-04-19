import { z } from "zod";

const productOptionSchema = z.object({ label: z.string(), value: z.string().min(1) }).nullable();

/** Shared quantity rules for add and edit hiking product lines. */
export const hikingProductQuantitiesSchema = z
  .object({
    personalQuantity: z.number({ error: "Required" }).int().positive("Must be > 0"),
    totalQuantity: z.number({ error: "Required" }).int().nonnegative("Must be ≥ 0"),
  })
  .superRefine((data, ctx) => {
    if (data.totalQuantity !== 0 && data.totalQuantity <= data.personalQuantity) {
      ctx.addIssue({
        code: "custom",
        message: "Total quantity must be greater than personal quantity (or 0)",
        path: ["totalQuantity"],
      });
    }
  });

export type HikingProductQuantitiesFormData = z.infer<typeof hikingProductQuantitiesSchema>;

export const addProductToHikingSchema = z
  .object({
    product: productOptionSchema,
  })
  .and(hikingProductQuantitiesSchema)
  .superRefine((data, ctx) => {
    if (data.product === null) {
      ctx.addIssue({ code: "custom", message: "Product is required", path: ["product"] });
    }
  });

export type AddProductToHikingFormData = z.infer<typeof addProductToHikingSchema>;

import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  kkal: z.number().min(0, "Must be 0 or more"),
  proteins: z.number().min(0, "Must be 0 or more"),
  fats: z.number().min(0, "Must be 0 or more"),
  carbohydrates: z.number().min(0, "Must be 0 or more"),
  price: z.number().min(0, "Must be 0 or more"),
  isVegetarian: z.boolean(),
  productCategoryId: z.string().min(1, "Category is required"),
  isCommon: z.boolean(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

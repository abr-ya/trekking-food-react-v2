import { z } from "zod";

const recipeIngredientSchema = z
  .object({
    product: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),
    quantity: z.number().min(1, "Quantity must be greater than 0"),
  })
  .refine((data) => data.product !== null && data.product.value.trim() !== "", {
    message: "Product is required",
    path: ["product"],
  });

export const recipeNameSchema = z.string().trim().min(1, "Name is required");
export const recipeDescriptionSchema = z.string().trim().min(1, "Description is required");
export const recipeCategoryIdSchema = z.string().min(1, "Recipe category is required");

export const createRecipeSchema = z.object({
  name: recipeNameSchema,
  categoryId: recipeCategoryIdSchema,
  description: recipeDescriptionSchema,
  ingredients: z.array(recipeIngredientSchema).min(1, "Add at least one ingredient"),
  isCommon: z.boolean(),
});

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;

export const editRecipeSchema = z.object({
  name: recipeNameSchema,
  description: recipeDescriptionSchema,
});

export type EditRecipeFormData = z.infer<typeof editRecipeSchema>;

export const editRecipeCategorySchema = z.object({
  categoryId: recipeCategoryIdSchema,
});

export type EditRecipeCategoryFormData = z.infer<typeof editRecipeCategorySchema>;

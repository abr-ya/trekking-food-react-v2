import { z } from "zod";

export const featureNameSchema = z.string().trim().min(1, "Name is required");
export const featureDescriptionSchema = z.string().trim().min(1, "Description is required");
export const featureFullTextSchema = z.string();
export const featureStatusSchema = z.enum(["DRAFT", "TODO", "IN_PROGRESS", "IN_TEST", "DONE"]);
export const featureLangSchema = z.enum(["EN", "RU"]);

export const featureFormSchema = z.object({
  name: featureNameSchema,
  description: featureDescriptionSchema,
  fullText: featureFullTextSchema,
  status: featureStatusSchema,
  isMain: z.boolean(),
  lang: featureLangSchema,
});

export type FeatureFormData = z.infer<typeof featureFormSchema>;

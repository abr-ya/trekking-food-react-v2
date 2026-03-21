import { z } from "zod";

export const authDialogSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  name: z.string().trim(),
});

export type AuthDialogFormData = z.infer<typeof authDialogSchema>;

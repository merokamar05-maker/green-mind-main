import { z } from "zod";

export const SignupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full Name must be at least 2 characters")
      .max(50, "Full Name must be less than 50 characters"),
    email: z
      .string()
      .email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be less than 30 characters"),
    confirmPassword: z.string(),
    childName: z
      .string()
      .min(2, "Child Name must be at least 2 characters")
      .max(50, "Child Name must be less than 50 characters"),
    childCode: z
      .string()
      .min(3, "Child Code must be at least 3 characters")
      .max(20, "Child Code must be less than 20 characters"),
    // ✅ إيميل الطفل — اختياري
    childEmail: z
      .string()
      .email("Invalid child email")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof SignupSchema>;

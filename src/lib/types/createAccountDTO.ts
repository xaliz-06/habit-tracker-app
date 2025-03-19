import { z } from "zod";

export const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(100, { message: "Name must be at most 100 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password must be at most 100 characters long" })
      .refine((value) => /[0-9]/.test(value), {
        message: "Password must contain at least one number",
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(1, { message: "Passwords do not match" }),
    imageURL: z.string().url({ message: "Invalid URL" }).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export type FormValues = z.input<typeof formSchema>;

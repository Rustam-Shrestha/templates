import { z } from "zod";
import { UuidV7Schema } from "./primitives.js";

export const LoginRequestSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    fullName: z.string().min(1, "Full name is required").optional()
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const UserProfileSchema = z.object({
  id: UuidV7Schema,
  email: z.string().email(),
  fullName: z.string().optional(),
  role: z.enum(["CUSTOMER", "LOAN_OFFICER", "ADMIN", "SUPERADMIN"]),
  phone: z.string().optional(),
  createdAtIso: z.iso.datetime()
});
export type UserProfile = z.infer<typeof UserProfileSchema>;


import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3),

  email: z.string().email(),

  phone: z.string().min(10),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  client_id: z.string().min(1),

  api_key: z.string().min(1),

  api_secret: z.string().min(1),

  terms: z.boolean().refine((val) => val === true, {
    message: "Accept Terms & Conditions",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(60),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[a-zA-Z]/, "Debe incluir al menos una letra")
      .regex(/[0-9]/, "Debe incluir al menos un número"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  });

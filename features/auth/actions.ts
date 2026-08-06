"use server";

import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { signIn } from "@/lib/auth/config";
import { loginSchema, registerSchema } from "./schemas";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function registerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { errors: { email: ["Ya existe una cuenta con este correo"] } };
  }

  const hashedPassword = await hashPassword(parsed.data.password);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      hashedPassword,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Cuenta creada. Inicia sesión con tus datos.",
      };
    }
    throw error;
  }

  return {};
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Correo o contraseña incorrectos" };
    }
    throw error;
  }

  return {};
}

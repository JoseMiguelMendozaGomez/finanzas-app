"use server";

import { randomBytes } from "crypto";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { signIn, signOut } from "@/lib/auth/config";
import { sendEmail } from "@/lib/email/send";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schemas";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

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

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
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

  const rememberMe = formData.get("rememberMe") === "on";

  // Chequeo informativo (solo lectura) para dar un mensaje específico —
  // el incremento/bloqueo real de intentos vive en authorize() para no
  // duplicar la lógica de escritura.
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { lockedUntil: true },
  });
  if (existing?.lockedUntil && existing.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil(
      (existing.lockedUntil.getTime() - Date.now()) / 60000
    );
    return {
      message: `Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta de nuevo en ${minutesLeft} minuto${minutesLeft === 1 ? "" : "s"}.`,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      rememberMe: rememberMe ? "true" : "false",
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

const GENERIC_RESET_MESSAGE =
  "Si el correo existe en nuestro sistema, te enviamos un enlace para restablecer tu contraseña.";

export async function requestPasswordResetAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, hashedPassword: true },
  });

  // Siempre devolvemos el mismo mensaje exista o no la cuenta, para no
  // revelar qué correos están registrados.
  if (user?.hashedPassword) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: parsed.data.email },
    });

    const token = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: parsed.data.email,
        token,
        expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: parsed.data.email,
      subject: "Restablecé tu contraseña — Inverza",
      html: `
        <p>Recibimos una solicitud para restablecer tu contraseña de Inverza.</p>
        <p><a href="${resetUrl}">Restablecer contraseña</a></p>
        <p>Este enlace vence en 1 hora. Si no pediste esto, ignorá este correo — tu contraseña sigue igual.</p>
      `,
    });
  }

  return { success: true, message: GENERIC_RESET_MESSAGE };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (!record || record.expires < new Date()) {
    return {
      message: "Este enlace no es válido o ya venció. Solicitá uno nuevo.",
    };
  }

  const hashedPassword = await hashPassword(parsed.data.password);
  await prisma.user.update({
    where: { email: record.identifier },
    data: { hashedPassword, failedLoginAttempts: 0, lockedUntil: null },
  });
  await prisma.verificationToken.deleteMany({
    where: { identifier: record.identifier },
  });

  return { success: true };
}

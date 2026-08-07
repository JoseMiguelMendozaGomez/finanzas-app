"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { updateProfileSchema, changePasswordSchema } from "./schemas";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
  });

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/home");
  return { success: true };
}

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.hashedPassword) {
    return { message: "No se pudo verificar tu contraseña actual." };
  }

  const isValid = await verifyPassword(
    parsed.data.currentPassword,
    user.hashedPassword
  );
  if (!isValid) {
    return {
      errors: { currentPassword: ["Contraseña actual incorrecta"] },
    };
  }

  const hashedPassword = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { hashedPassword },
  });

  return { success: true };
}

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_BYTES = 3 * 1024 * 1024; // 3MB — el cliente ya lo redimensiona antes de subir

export async function uploadAvatarAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { message: "Seleccioná una foto." };
  }
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { message: "Formato no soportado. Usá JPG, PNG o WEBP." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { message: "La imagen es muy pesada." };
  }

  const data = Buffer.from(await file.arrayBuffer());

  await prisma.userAvatar.upsert({
    where: { userId },
    create: { userId, data, mimeType: file.type },
    update: { data, mimeType: file.type },
  });

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/home");
  return { success: true };
}

export async function deleteAvatarAction() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;

  await prisma.userAvatar.deleteMany({ where: { userId } });

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/home");
}

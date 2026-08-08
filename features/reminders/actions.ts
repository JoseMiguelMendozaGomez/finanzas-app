"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { createReminderSchema, updateReminderSchema } from "./schemas";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

async function requireUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function createReminderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = createReminderSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.reminder.create({
    data: {
      userId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      dueDate: new Date(parsed.data.dueDate),
    },
  });

  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateReminderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = updateReminderSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const result = await prisma.reminder.updateMany({
    where: { id: parsed.data.id, userId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      dueDate: new Date(parsed.data.dueDate),
    },
  });

  if (result.count === 0) {
    return { message: "No se pudo actualizar este recordatorio." };
  }

  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleReminderStatusAction(reminderId: string) {
  const userId = await requireUserId();
  if (!userId) return;

  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, userId },
  });
  if (!reminder) return;

  await prisma.reminder.update({
    where: { id: reminder.id },
    data: { status: reminder.status === "PAID" ? "PENDING" : "PAID" },
  });

  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
}

export async function deleteReminderAction(reminderId: string) {
  const userId = await requireUserId();
  if (!userId) return;

  await prisma.reminder.deleteMany({ where: { id: reminderId, userId } });

  revalidatePath("/recordatorios");
  revalidatePath("/dashboard");
}

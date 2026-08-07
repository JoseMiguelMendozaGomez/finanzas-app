"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import {
  createGoalSchema,
  updateGoalSchema,
  contributeSchema,
  withdrawSchema,
} from "./schemas";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

async function requireUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function createGoalAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = createGoalSchema.safeParse({
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    deadline: formData.get("deadline"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.goal.create({
    data: {
      userId,
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
    },
  });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateGoalAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = updateGoalSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    deadline: formData.get("deadline"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const result = await prisma.goal.updateMany({
    where: { id: parsed.data.id, userId },
    data: {
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
    },
  });

  if (result.count === 0) {
    return { message: "No se pudo actualizar esta meta." };
  }

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function contributeToGoalAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = contributeSchema.safeParse({
    goalId: formData.get("goalId"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const goal = await prisma.goal.findFirst({
    where: { id: parsed.data.goalId, userId },
  });
  if (!goal) {
    return { message: "Meta no encontrada." };
  }

  await prisma.goal.update({
    where: { id: goal.id },
    data: { currentAmount: { increment: parsed.data.amount } },
  });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function withdrawFromGoalAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = withdrawSchema.safeParse({
    goalId: formData.get("goalId"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const goal = await prisma.goal.findFirst({
    where: { id: parsed.data.goalId, userId },
  });
  if (!goal) {
    return { message: "Meta no encontrada." };
  }

  if (parsed.data.amount > Number(goal.currentAmount)) {
    return {
      errors: {
        amount: ["No puedes retirar más de lo que hay ahorrado en esta meta"],
      },
    };
  }

  await prisma.goal.update({
    where: { id: goal.id },
    data: { currentAmount: { decrement: parsed.data.amount } },
  });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteGoalAction(goalId: string) {
  const userId = await requireUserId();
  if (!userId) return;

  await prisma.goal.deleteMany({ where: { id: goalId, userId } });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
}

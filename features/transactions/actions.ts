"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { createIncomeSchema } from "./schemas";
import { DEFAULT_CATEGORY_ICON } from "./default-categories";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createIncomeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = createIncomeSchema.safeParse({
    amount: formData.get("amount"),
    date: formData.get("date"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId") || undefined,
    newCategoryName: formData.get("newCategoryName") || undefined,
    newCategoryIcon: formData.get("newCategoryIcon") || undefined,
    isRecurring: formData.get("isRecurring") === "on",
    recurrenceFrequency: formData.get("recurrenceFrequency") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const userId = session.user.id;
  const data = parsed.data;

  let categoryId = data.categoryId;

  if (!categoryId && data.newCategoryName) {
    const category = await prisma.category.upsert({
      where: {
        userId_name_type: {
          userId,
          name: data.newCategoryName,
          type: "INCOME",
        },
      },
      update: {},
      create: {
        userId,
        name: data.newCategoryName,
        type: "INCOME",
        icon: data.newCategoryIcon ?? DEFAULT_CATEGORY_ICON,
      },
    });
    categoryId = category.id;
  }

  if (!categoryId) {
    return { errors: { categoryId: ["Selecciona o crea una categoría"] } };
  }

  await prisma.transaction.create({
    data: {
      type: "INCOME",
      amount: data.amount,
      date: new Date(data.date),
      description: data.description || null,
      isRecurring: data.isRecurring,
      recurrenceFrequency: data.isRecurring
        ? data.recurrenceFrequency
        : null,
      userId,
      categoryId,
    },
  });

  revalidatePath("/dashboard");
  return {};
}

export async function deleteIncomeAction(transactionId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.transaction.deleteMany({
    where: { id: transactionId, userId: session.user.id, type: "INCOME" },
  });

  revalidatePath("/dashboard");
}

"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import {
  createTransactionSchema,
  updateTransactionSchema,
  editOccurrenceSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./schemas";
import { DEFAULT_CATEGORY_ICON } from "./default-categories";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

type TxType = "INCOME" | "EXPENSE";

async function requireUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

// ─── Transacciones ─────────────────────────────────────────────────────────

export async function createTransactionAction(
  type: TxType,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = createTransactionSchema.safeParse({
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

  const data = parsed.data;
  let categoryId = data.categoryId;

  if (!categoryId && data.newCategoryName) {
    const category = await prisma.category.upsert({
      where: {
        userId_name_type: { userId, name: data.newCategoryName, type },
      },
      update: {},
      create: {
        userId,
        name: data.newCategoryName,
        type,
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
      type,
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
  revalidatePath("/resumen");
  revalidatePath("/categorias");
  return {};
}

export async function updateTransactionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = updateTransactionSchema.safeParse({
    id: formData.get("id"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    isRecurring: formData.get("isRecurring") === "on",
    recurrenceFrequency: formData.get("recurrenceFrequency") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const result = await prisma.transaction.updateMany({
    where: { id: data.id, userId },
    data: {
      amount: data.amount,
      date: new Date(data.date),
      description: data.description || null,
      categoryId: data.categoryId,
      isRecurring: data.isRecurring,
      recurrenceFrequency: data.isRecurring
        ? data.recurrenceFrequency
        : null,
    },
  });

  if (result.count === 0) {
    return { message: "No se pudo actualizar esta transacción." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/resumen");
  revalidatePath("/categorias");
  return { success: true };
}

/**
 * Edita el monto de una única ocurrencia dentro de una transacción
 * recurrente (ej: el super de este mes salió más caro de lo normal) sin
 * tocar el monto "plantilla" que se usa para proyectar los demás meses.
 *
 * Marca esa fecha como excluida de la proyección y crea una transacción
 * real independiente (no recurrente) para ese día con el monto nuevo.
 * Si la transacción no es recurrente, simplemente actualiza su monto.
 */
export async function editOccurrenceAmountAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = editOccurrenceSchema.safeParse({
    transactionId: formData.get("transactionId"),
    occurrenceDate: formData.get("occurrenceDate"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const transaction = await prisma.transaction.findFirst({
    where: { id: parsed.data.transactionId, userId },
  });
  if (!transaction) {
    return { message: "Transacción no encontrada." };
  }

  const occurrenceDate = new Date(parsed.data.occurrenceDate);

  if (!transaction.isRecurring) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { amount: parsed.data.amount },
    });
  } else {
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: { excludedDates: { push: occurrenceDate } },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: transaction.type,
          amount: parsed.data.amount,
          date: occurrenceDate,
          description: transaction.description,
          categoryId: transaction.categoryId,
          isRecurring: false,
        },
      }),
    ]);
  }

  revalidatePath("/resumen");
  revalidatePath("/dashboard");
  revalidatePath("/reportes");
  return { success: true };
}

export async function deleteTransactionAction(transactionId: string) {
  const userId = await requireUserId();
  if (!userId) return;

  await prisma.transaction.deleteMany({
    where: { id: transactionId, userId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/resumen");
  revalidatePath("/categorias");
}

// ─── Categorías ─────────────────────────────────────────────────────────────

export async function createCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon") || undefined,
    color: formData.get("color") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.category.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        icon: data.icon ?? DEFAULT_CATEGORY_ICON,
        color: data.color || null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { errors: { name: ["Ya existe una categoría con ese nombre"] } };
    }
    throw error;
  }

  revalidatePath("/categorias");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = updateCategorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    icon: formData.get("icon"),
    color: formData.get("color") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    const result = await prisma.category.updateMany({
      where: { id: data.id, userId },
      data: { name: data.name, icon: data.icon, color: data.color || null },
    });
    if (result.count === 0) {
      return { message: "No se pudo actualizar esta categoría." };
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { errors: { name: ["Ya existe una categoría con ese nombre"] } };
    }
    throw error;
  }

  revalidatePath("/categorias");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<{ message?: string }> {
  const userId = await requireUserId();
  if (!userId) return { message: "Tu sesión expiró." };

  try {
    await prisma.category.deleteMany({ where: { id: categoryId, userId } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        message:
          "No se puede eliminar: hay transacciones usando esta categoría.",
      };
    }
    throw error;
  }

  revalidatePath("/categorias");
  revalidatePath("/dashboard");
  return {};
}

/**
 * Reclasifica una categoría (gasto <-> ingreso) — para corregir una
 * categoría creada con el tipo equivocado. Si ya tiene transacciones
 * asociadas, también se les cambia el tipo a todas para que sigan siendo
 * consistentes con su categoría (una categoría de gasto no puede tener
 * transacciones de ingreso colgando).
 */
export async function changeCategoryTypeAction(
  categoryId: string
): Promise<{ message?: string }> {
  const userId = await requireUserId();
  if (!userId) return { message: "Tu sesión expiró." };

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) return { message: "Categoría no encontrada." };

  const newType = category.type === "INCOME" ? "EXPENSE" : "INCOME";

  try {
    await prisma.$transaction([
      prisma.category.update({
        where: { id: categoryId },
        data: { type: newType },
      }),
      prisma.transaction.updateMany({
        where: { categoryId, userId },
        data: { type: newType },
      }),
    ]);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        message: `Ya existe una categoría de ${
          newType === "INCOME" ? "ingresos" : "gastos"
        } con ese nombre.`,
      };
    }
    throw error;
  }

  revalidatePath("/categorias");
  revalidatePath("/dashboard");
  revalidatePath("/resumen");
  revalidatePath("/reportes");
  return {};
}

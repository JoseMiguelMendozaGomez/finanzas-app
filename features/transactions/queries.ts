import { prisma } from "@/lib/prisma/client";
import { getDefaultCategories } from "./default-categories";

type TxType = "INCOME" | "EXPENSE";

export async function getCategories(userId: string, type: TxType) {
  const categories = await prisma.category.findMany({
    where: { userId, type },
    orderBy: { name: "asc" },
  });

  const existingNames = new Set(categories.map((c) => c.name));
  const suggestions = getDefaultCategories(type).filter(
    (c) => !existingNames.has(c.name)
  );

  return { categories, suggestions };
}

/**
 * Una transacción recurrente cuya propia fecha de origen fue editada de
 * forma individual (ver editOccurrenceAmountAction) sigue existiendo como
 * "plantilla" para proyectar los meses siguientes, pero esa ocurrencia
 * puntual ya la representa una transacción real independiente — por eso no
 * debe listarse dos veces en el historial plano.
 */
export function isHiddenRecurrenceTemplate<
  T extends { isRecurring: boolean; date: Date; excludedDates: Date[] },
>(t: T): boolean {
  if (!t.isRecurring) return false;
  const originTime = t.date.getTime();
  return t.excludedDates.some((d) => d.getTime() === originTime);
}

export async function getTransactionsByType(userId: string, type: TxType) {
  const transactions = await prisma.transaction.findMany({
    where: { userId, type },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  // Decimal no es serializable de Server a Client Component — se convierte a number.
  return transactions
    .filter((t) => !isHiddenRecurrenceTemplate(t))
    .map((t) => ({
      ...t,
      amount: t.amount.toNumber(),
    }));
}

export async function getTransactionTotal(userId: string, type: TxType) {
  const transactions = await prisma.transaction.findMany({
    where: { userId, type },
    select: { amount: true, isRecurring: true, date: true, excludedDates: true },
  });
  return transactions
    .filter((t) => !isHiddenRecurrenceTemplate(t))
    .reduce((sum, t) => sum + t.amount.toNumber(), 0);
}

/** Todas las transacciones (ingresos + gastos) — para el calendario de Resumen. */
export async function getAllTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return transactions.map((t) => ({
    ...t,
    amount: t.amount.toNumber(),
  }));
}

/** Todas las categorías del usuario (ambos tipos) con conteo de uso — para /categorias. */
export async function getAllCategoriesWithCounts(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    include: { _count: { select: { transactions: true } } },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

import { prisma } from "@/lib/prisma/client";
import { DEFAULT_INCOME_CATEGORIES } from "./default-categories";

export async function getIncomeCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId, type: "INCOME" },
    orderBy: { name: "asc" },
  });

  const existingNames = new Set(categories.map((c) => c.name));
  const suggestions = DEFAULT_INCOME_CATEGORIES.filter(
    (c) => !existingNames.has(c.name)
  );

  return { categories, suggestions };
}

export async function getIncomeTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId, type: "INCOME" },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  // Decimal no es serializable de Server a Client Component — se convierte a number.
  return transactions.map((t) => ({
    ...t,
    amount: t.amount.toNumber(),
  }));
}

export async function getIncomeTotal(userId: string) {
  const result = await prisma.transaction.aggregate({
    where: { userId, type: "INCOME" },
    _sum: { amount: true },
  });
  return result._sum.amount?.toNumber() ?? 0;
}

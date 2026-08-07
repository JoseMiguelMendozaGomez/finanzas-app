import type { getAllTransactions } from "@/features/transactions/queries";
import { isHiddenRecurrenceTemplate } from "@/features/transactions/recurrence";

type Transactions = Awaited<ReturnType<typeof getAllTransactions>>;
type TxType = "INCOME" | "EXPENSE";

export const MONTH_NAMES_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export interface CategoryBreakdownItem {
  categoryId: string;
  name: string;
  color: string | null;
  icon: string | null;
  total: number;
}

function transactionsInMonth(
  transactions: Transactions,
  year: number,
  month: number
) {
  return transactions.filter((t) => {
    if (isHiddenRecurrenceTemplate(t)) return false;
    const d = new Date(t.date);
    return d.getUTCFullYear() === year && d.getUTCMonth() === month;
  });
}

export function computeCategoryBreakdown(
  transactions: Transactions,
  type: TxType,
  year: number,
  month: number
): CategoryBreakdownItem[] {
  const totals = new Map<string, CategoryBreakdownItem>();

  for (const t of transactionsInMonth(transactions, year, month)) {
    if (t.type !== type) continue;
    const existing = totals.get(t.category.id);
    if (existing) {
      existing.total += t.amount;
    } else {
      totals.set(t.category.id, {
        categoryId: t.category.id,
        name: t.category.name,
        color: t.category.color,
        icon: t.category.icon,
        total: t.amount,
      });
    }
  }

  return [...totals.values()].sort((a, b) => b.total - a.total);
}

export interface MonthlyTrendItem {
  year: number;
  month: number;
  label: string;
  income: number;
  expense: number;
}

export function computeMonthlyTrend(
  transactions: Transactions,
  year: number,
  month: number,
  monthsBack = 6
): MonthlyTrendItem[] {
  const buckets: MonthlyTrendItem[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(year, month - i, 1));
    buckets.push({
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
      label: MONTH_NAMES_SHORT[d.getUTCMonth()],
      income: 0,
      expense: 0,
    });
  }

  for (const t of transactions) {
    if (isHiddenRecurrenceTemplate(t)) continue;
    const d = new Date(t.date);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const bucket = buckets.find((b) => b.year === y && b.month === m);
    if (!bucket) continue;
    if (t.type === "INCOME") bucket.income += t.amount;
    else bucket.expense += t.amount;
  }

  return buckets;
}

export interface ReportSummary {
  income: number;
  expense: number;
  balance: number;
  topExpenseCategory: string | null;
}

export function computeReportSummary(
  transactions: Transactions,
  year: number,
  month: number
): ReportSummary {
  const incomeBreakdown = computeCategoryBreakdown(
    transactions,
    "INCOME",
    year,
    month
  );
  const expenseBreakdown = computeCategoryBreakdown(
    transactions,
    "EXPENSE",
    year,
    month
  );

  const income = incomeBreakdown.reduce((sum, c) => sum + c.total, 0);
  const expense = expenseBreakdown.reduce((sum, c) => sum + c.total, 0);

  return {
    income,
    expense,
    balance: income - expense,
    topExpenseCategory: expenseBreakdown[0]?.name ?? null,
  };
}

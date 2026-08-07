import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import DashboardHome from "@/components/dashboard/DashboardHome";
import {
  getCategories,
  getTransactionsByType,
  getTransactionTotal,
} from "@/features/transactions/queries";
import { getGoalsSummary } from "@/features/goals/queries";
import { getPendingRemindersSummary } from "@/features/reminders/queries";
import { getProfile } from "@/features/profile/queries";

export const metadata: Metadata = {
  title: "Dashboard — Inverza",
  description: "Panel principal de tu gestión financiera personal.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [
    incomeCategories,
    incomeTransactions,
    incomeTotal,
    expenseCategories,
    expenseTransactions,
    expenseTotal,
    goalsSummary,
    remindersSummary,
    profile,
  ] = await Promise.all([
    getCategories(userId, "INCOME"),
    getTransactionsByType(userId, "INCOME"),
    getTransactionTotal(userId, "INCOME"),
    getCategories(userId, "EXPENSE"),
    getTransactionsByType(userId, "EXPENSE"),
    getTransactionTotal(userId, "EXPENSE"),
    getGoalsSummary(userId),
    getPendingRemindersSummary(userId),
    getProfile(userId),
  ]);

  return (
    <DashboardHome
      incomeTotal={incomeTotal}
      incomeCategories={incomeCategories}
      incomeTransactions={incomeTransactions}
      expenseTotal={expenseTotal}
      expenseCategories={expenseCategories}
      expenseTransactions={expenseTransactions}
      goalsCount={goalsSummary.count}
      goalsAchieved={goalsSummary.achieved}
      remindersPending={remindersSummary.pendingCount}
      remindersOverdue={remindersSummary.overdue}
      userName={profile?.name ?? null}
    />
  );
}

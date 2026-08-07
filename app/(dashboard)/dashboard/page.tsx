import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import DashboardHome from "@/components/dashboard/DashboardHome";
import {
  getIncomeCategories,
  getIncomeTransactions,
  getIncomeTotal,
} from "@/features/transactions/queries";

export const metadata: Metadata = {
  title: "Dashboard — Finanzas App",
  description: "Panel principal de tu gestión financiera personal.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [incomeCategories, incomeTransactions, incomeTotal] =
    await Promise.all([
      getIncomeCategories(userId),
      getIncomeTransactions(userId),
      getIncomeTotal(userId),
    ]);

  return (
    <DashboardHome
      incomeTotal={incomeTotal}
      incomeCategories={incomeCategories}
      incomeTransactions={incomeTransactions}
    />
  );
}

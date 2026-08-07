import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { getAllTransactions } from "@/features/transactions/queries";
import ReportsView from "@/components/dashboard/reports/ReportsView";

export const metadata: Metadata = {
  title: "Reportes — Finanzas App",
  description: "Gráficos de tus ingresos y gastos.",
};

export default async function ReportesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const transactions = await getAllTransactions(session.user.id);

  return <ReportsView transactions={transactions} />;
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { getAllTransactions } from "@/features/transactions/queries";
import ResumenView from "@/components/dashboard/resumen/ResumenView";

export const metadata: Metadata = {
  title: "Resumen — Inverza",
  description: "Calendario de ingresos y gastos con balance del mes.",
};

export default async function ResumenPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const transactions = await getAllTransactions(session.user.id);

  return <ResumenView transactions={transactions} />;
}

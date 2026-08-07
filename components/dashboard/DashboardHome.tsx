"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui";
import DashboardCard from "@/components/dashboard/DashboardCard";
import TransactionView from "@/components/dashboard/transactions/TransactionView";
import { getGreeting } from "@/features/profile/greeting";
import type {
  getCategories,
  getTransactionsByType,
} from "@/features/transactions/queries";

interface DashboardHomeProps {
  incomeTotal: number;
  incomeCategories: Awaited<ReturnType<typeof getCategories>>;
  incomeTransactions: Awaited<ReturnType<typeof getTransactionsByType>>;
  expenseTotal: number;
  expenseCategories: Awaited<ReturnType<typeof getCategories>>;
  expenseTransactions: Awaited<ReturnType<typeof getTransactionsByType>>;
  goalsCount: number;
  goalsAchieved: number;
  remindersPending: number;
  remindersOverdue: number;
  userName: string | null;
}

const roadmap = ["Exportar reportes a PDF", "Inicio de sesión con Google"];

export default function DashboardHome({
  incomeTotal,
  incomeCategories,
  incomeTransactions,
  expenseTotal,
  expenseCategories,
  expenseTransactions,
  goalsCount,
  goalsAchieved,
  remindersPending,
  remindersOverdue,
  userName,
}: DashboardHomeProps) {
  const router = useRouter();
  const [view, setView] = useState<"overview" | "income" | "expense">(
    "overview"
  );
  // Se calcula en el cliente (después del montaje) en vez de en el render
  // inicial para evitar un mismatch de hidratación si la hora del servidor
  // no coincide con la zona horaria local del usuario — la hora local solo
  // existe en el cliente, así que este efecto es la excepción legítima al
  // patrón de derivar estado en render.
  const [greeting, setGreeting] = useState("Hola");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getGreeting());
  }, []);

  if (view === "income") {
    return (
      <TransactionView
        type="INCOME"
        categories={incomeCategories.categories}
        suggestions={incomeCategories.suggestions}
        transactions={incomeTransactions}
        total={incomeTotal}
        onBack={() => setView("overview")}
      />
    );
  }

  if (view === "expense") {
    return (
      <TransactionView
        type="EXPENSE"
        categories={expenseCategories.categories}
        suggestions={expenseCategories.suggestions}
        transactions={expenseTransactions}
        total={expenseTotal}
        onBack={() => setView("overview")}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con saludo personalizado */}
      <PageHeader
        eyebrow="Finanzas App"
        title={`${greeting}${userName ? `, ${userName}` : ""}`}
        description="Resumen general de tu situación financiera personal."
      />

      {/* Tarjetas de resumen */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Resumen financiero
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <DashboardCard
            title="Ingresos"
            description="Registra y visualiza todas tus fuentes de ingresos."
            value={`$${incomeTotal.toFixed(2)}`}
            color="emerald"
            onClick={() => setView("income")}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          />
          <DashboardCard
            title="Gastos"
            description="Controla en qué y cuánto estás gastando."
            value={`$${expenseTotal.toFixed(2)}`}
            color="red"
            onClick={() => setView("expense")}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 12H4"
                />
              </svg>
            }
          />
          <DashboardCard
            title="Metas de ahorro"
            description="Sigue el progreso hacia tus objetivos financieros."
            value={
              goalsCount === 0
                ? "0 metas"
                : `${goalsAchieved}/${goalsCount} completadas`
            }
            color="blue"
            onClick={() => router.push("/metas")}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <DashboardCard
            title="Recordatorios"
            description="Pagos y fechas importantes próximas."
            value={
              remindersPending === 0
                ? "0 pendientes"
                : remindersOverdue > 0
                  ? `${remindersOverdue} vencido${remindersOverdue === 1 ? "" : "s"}`
                  : `${remindersPending} pendiente${remindersPending === 1 ? "" : "s"}`
            }
            color="violet"
            onClick={() => router.push("/recordatorios")}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            }
          />
          <DashboardCard
            title="Reportes"
            description="Gráficos para entender tus ingresos y gastos."
            value="Ver análisis"
            color="blue"
            onClick={() => router.push("/reportes")}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l6-3v13M9 19l-6-3V9m6 10l6-3M9 6L3 9m12 4l6-3m-6 3V7m6 6v6l-6 3"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Próximas funcionalidades */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-5">
          Próximas funcionalidades
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roadmap.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-slate-50 shrink-0" />
              <span className="text-sm text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

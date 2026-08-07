"use client";

import { useState } from "react";
import { PageHeader, Badge } from "@/components/ui";
import DashboardCard from "@/components/dashboard/DashboardCard";
import IncomeView from "@/components/dashboard/income/IncomeView";
import type {
  getIncomeCategories,
  getIncomeTransactions,
} from "@/features/transactions/queries";

interface DashboardHomeProps {
  incomeTotal: number;
  incomeCategories: Awaited<ReturnType<typeof getIncomeCategories>>;
  incomeTransactions: Awaited<ReturnType<typeof getIncomeTransactions>>;
}

const staticCards = [
  {
    id: "gastos",
    title: "Gastos",
    description: "Controla en qué y cuánto estás gastando.",
    value: "$0.00",
    icon: (
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
    ),
    color: "red" as const,
  },
  {
    id: "metas",
    title: "Metas de ahorro",
    description: "Sigue el progreso hacia tus objetivos financieros.",
    value: "0 metas",
    icon: (
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
    ),
    color: "blue" as const,
  },
  {
    id: "recordatorios",
    title: "Recordatorios",
    description: "Pagos y fechas importantes próximas.",
    value: "0 pendientes",
    icon: (
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
    ),
    color: "violet" as const,
  },
];

const roadmap = [
  "Gestión de categorías",
  "Metas de ahorro con progreso",
  "Recordatorios automáticos",
  "Reportes y gráficos",
];

export default function DashboardHome({
  incomeTotal,
  incomeCategories,
  incomeTransactions,
}: DashboardHomeProps) {
  const [view, setView] = useState<"overview" | "income">("overview");

  if (view === "income") {
    return (
      <IncomeView
        categories={incomeCategories.categories}
        suggestions={incomeCategories.suggestions}
        transactions={incomeTransactions}
        total={incomeTotal}
        onBack={() => setView("overview")}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        eyebrow="Finanzas App"
        title="Dashboard"
        description="Resumen general de tu situación financiera personal."
        badge={{ label: "v0.1 — UI Preview", color: "blue", variant: "soft" }}
      />

      {/* Banner de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-white">
              Bienvenido a Finanzas App
            </p>
            <p className="text-blue-100 text-sm mt-0.5">
              Tu panel financiero personal. Los módulos se habilitarán
              progresivamente.
            </p>
          </div>
        </div>
        <Badge
          color="blue"
          variant="solid"
          className="shrink-0 bg-white/15 text-white border-white/20"
        >
          En construcción
        </Badge>
      </div>

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
          {staticCards.map(({ id, ...card }) => (
            <DashboardCard key={id} {...card} />
          ))}
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

"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { PageHeader, CategoryIcon } from "@/components/ui";
import { MONTH_NAMES, addMonths } from "@/lib/utils/dates";
import {
  computeCategoryBreakdown,
  computeMonthlyTrend,
  computeReportSummary,
} from "@/features/reports/aggregate";
import type { getAllTransactions } from "@/features/transactions/queries";
import type { CategoryIconName } from "@/features/transactions/default-categories";

interface ReportsViewProps {
  transactions: Awaited<ReturnType<typeof getAllTransactions>>;
}

const FALLBACK_PALETTE = [
  "#78406f", "#2563eb", "#059669", "#d97706",
  "#dc2626", "#0891b2", "#7c3aed", "#65a30d",
];

const now = new Date();

export default function ReportsView({ transactions }: ReportsViewProps) {
  const [{ year, month }, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [breakdownType, setBreakdownType] = useState<"EXPENSE" | "INCOME">(
    "EXPENSE"
  );

  function goToMonth(delta: number) {
    setCursor((c) => addMonths(c.year, c.month, delta));
  }

  const summary = useMemo(
    () => computeReportSummary(transactions, year, month),
    [transactions, year, month]
  );

  const breakdown = useMemo(
    () => computeCategoryBreakdown(transactions, breakdownType, year, month),
    [transactions, breakdownType, year, month]
  );

  const trend = useMemo(
    () => computeMonthlyTrend(transactions, year, month, 6),
    [transactions, year, month]
  );

  const breakdownTotal = breakdown.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finanzas App"
        title="Reportes"
        description="Gráficos para entender en qué gastas y de dónde vienen tus ingresos."
      />

      {/* Selector de mes */}
      <div className="flex items-center justify-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-sm font-semibold text-slate-700 min-w-[9rem] text-center">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Mes siguiente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Resumen del mes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Ingresos
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            ${summary.income.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Gastos
          </p>
          <p className="text-2xl font-bold text-red-600">
            ${summary.expense.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Balance
          </p>
          <p
            className={`text-2xl font-bold ${
              summary.balance >= 0 ? "text-slate-900" : "text-red-600"
            }`}
          >
            ${summary.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Desglose por categoría */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            Desglose por categoría
          </h2>
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setBreakdownType("EXPENSE")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                breakdownType === "EXPENSE"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Gastos
            </button>
            <button
              type="button"
              onClick={() => setBreakdownType("INCOME")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                breakdownType === "INCOME"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Ingresos
            </button>
          </div>
        </div>

        {breakdown.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay {breakdownType === "EXPENSE" ? "gastos" : "ingresos"}{" "}
            registrados en {MONTH_NAMES[month]} {year}.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="total"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {breakdown.map((entry, i) => (
                      <Cell
                        key={entry.categoryId}
                        fill={entry.color || FALLBACK_PALETTE[i % FALLBACK_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${Number(value).toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2.5">
              {breakdown.map((c, i) => {
                const pct = breakdownTotal > 0 ? (c.total / breakdownTotal) * 100 : 0;
                const color = c.color || FALLBACK_PALETTE[i % FALLBACK_PALETTE.length];
                return (
                  <li key={c.categoryId} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      <CategoryIcon
                        name={(c.icon as CategoryIconName) ?? "other"}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {c.name}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 shrink-0">
                          ${c.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Tendencia mensual */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-5">
          Tendencia — últimos 6 meses
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Ingresos" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Gastos" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

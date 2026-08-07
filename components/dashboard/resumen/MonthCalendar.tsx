"use client";

import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  daysInMonth,
  firstWeekdayOfMonth,
  isToday,
} from "@/lib/utils/dates";
import {
  getMonthOccurrences,
  type MonthOccurrence,
} from "@/features/transactions/recurrence";
import type { getAllTransactions } from "@/features/transactions/queries";
import DayOccurrenceRow from "./DayOccurrenceRow";

type Transactions = Awaited<ReturnType<typeof getAllTransactions>>;

interface DayTotals {
  income: number;
  expense: number;
  items: MonthOccurrence[];
}

interface MonthCalendarProps {
  year: number;
  month: number; // 0-11
  transactions: Transactions;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthCalendar({
  year,
  month,
  transactions,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  const totalDays = daysInMonth(year, month);
  const leadingBlanks = firstWeekdayOfMonth(year, month);

  const occurrences = getMonthOccurrences(transactions, year, month);

  const byDay = new Map<number, DayTotals>();
  for (const occ of occurrences) {
    const day = occ.date.getUTCDate();
    const entry = byDay.get(day) ?? { income: 0, expense: 0, items: [] };
    if (occ.transaction.type === "INCOME") entry.income += occ.transaction.amount;
    else entry.expense += occ.transaction.amount;
    entry.items.push(occ);
    byDay.set(day, entry);
  }

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
      {/* Header: mes + navegación */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Mes anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Mes siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wide py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="aspect-square" />;
          }
          const totals = byDay.get(day);
          const today = isToday(year, month, day);
          const selected = selectedDay === day;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`aspect-square rounded-xl border p-1.5 sm:p-2 flex flex-col items-start justify-start text-left transition-colors ${
                selected
                  ? "bg-blue-50 border-blue-300"
                  : today
                    ? "bg-slate-50 border-slate-300"
                    : "bg-white border-slate-100 hover:bg-slate-50"
              }`}
            >
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  today ? "text-blue-700" : "text-slate-700"
                }`}
              >
                {day}
              </span>
              <div className="mt-auto w-full space-y-0.5">
                {totals?.income ? (
                  <p className="text-[9px] sm:text-xs font-medium text-emerald-600 truncate" title={`+$${totals.income.toFixed(2)}`}>
                    +${totals.income.toFixed(2)}
                  </p>
                ) : null}
                {totals?.expense ? (
                  <p className="text-[9px] sm:text-xs font-medium text-red-600 truncate" title={`-$${totals.expense.toFixed(2)}`}>
                    -${totals.expense.toFixed(2)}
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalle del día seleccionado */}
      {selectedDay !== null && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            {selectedDay} de {MONTH_NAMES[month]}
          </h3>
          {byDay.get(selectedDay)?.items.length ? (
            <ul className="space-y-1">
              {byDay.get(selectedDay)!.items.map((occ) => (
                <DayOccurrenceRow
                  key={`${occ.transaction.id}-${occ.date.getTime()}`}
                  occurrence={occ}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">
              Sin movimientos registrados este día.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

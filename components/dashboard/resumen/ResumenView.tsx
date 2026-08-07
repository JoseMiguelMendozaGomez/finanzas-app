"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui";
import BalanceSummary from "@/components/dashboard/resumen/BalanceSummary";
import MonthCalendar from "@/components/dashboard/resumen/MonthCalendar";
import { MONTH_NAMES, addMonths } from "@/lib/utils/dates";
import { getMonthOccurrences } from "@/features/transactions/recurrence";
import type { getAllTransactions } from "@/features/transactions/queries";

interface ResumenViewProps {
  transactions: Awaited<ReturnType<typeof getAllTransactions>>;
}

const now = new Date();

export default function ResumenView({ transactions }: ResumenViewProps) {
  const [{ year, month }, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { income, expense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const occ of getMonthOccurrences(transactions, year, month)) {
      if (occ.transaction.type === "INCOME") income += occ.transaction.amount;
      else expense += occ.transaction.amount;
    }
    return { income, expense };
  }, [transactions, year, month]);

  function goToMonth(delta: number) {
    setCursor((c) => addMonths(c.year, c.month, delta));
    setSelectedDay(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finanzas App"
        title="Resumen"
        description="Vista de calendario de todos tus ingresos y gastos."
      />

      <BalanceSummary
        income={income}
        expense={expense}
        monthLabel={`${MONTH_NAMES[month]} ${year}`}
      />

      <MonthCalendar
        year={year}
        month={month}
        transactions={transactions}
        selectedDay={selectedDay}
        onSelectDay={(day) =>
          setSelectedDay((prev) => (prev === day ? null : day))
        }
        onPrevMonth={() => goToMonth(-1)}
        onNextMonth={() => goToMonth(1)}
      />
    </div>
  );
}

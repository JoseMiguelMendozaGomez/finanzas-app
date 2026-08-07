import { daysInMonth } from "@/lib/utils/dates";
import type { getAllTransactions } from "./queries";

type Transactions = Awaited<ReturnType<typeof getAllTransactions>>;
export type TransactionItem = Transactions[number];

export interface MonthOccurrence {
  date: Date;
  transaction: TransactionItem;
  /** true si es una repetición proyectada (no una fila real de la base) */
  projected: boolean;
}

/**
 * Una transacción recurrente cuya propia fecha de origen fue editada de
 * forma individual (ver editOccurrenceAmountAction) sigue existiendo como
 * "plantilla" para proyectar los meses siguientes, pero esa ocurrencia
 * puntual ya la representa una transacción real independiente — por eso no
 * debe listarse dos veces en el historial plano.
 *
 * Vive acá (y no en queries.ts) porque este archivo no importa nada del
 * lado servidor — así lo pueden usar tanto Server como Client Components
 * (ej. features/reports/aggregate.ts, usado desde ReportsView) sin arrastrar
 * el cliente de Prisma/pg al bundle del navegador.
 */
export function isHiddenRecurrenceTemplate<
  T extends { isRecurring: boolean; date: Date; excludedDates: Date[] },
>(t: T): boolean {
  if (!t.isRecurring) return false;
  const originTime = t.date.getTime();
  return t.excludedDates.some((d) => d.getTime() === originTime);
}

const MAX_ITERATIONS = 500;

function addPeriod(date: Date, frequency: string): Date {
  const d = new Date(date);
  switch (frequency) {
    case "WEEKLY":
      d.setUTCDate(d.getUTCDate() + 7);
      return d;
    case "BIWEEKLY":
      d.setUTCDate(d.getUTCDate() + 14);
      return d;
    case "MONTHLY": {
      const day = d.getUTCDate();
      d.setUTCDate(1);
      d.setUTCMonth(d.getUTCMonth() + 1);
      const lastDay = daysInMonth(d.getUTCFullYear(), d.getUTCMonth());
      d.setUTCDate(Math.min(day, lastDay));
      return d;
    }
    case "ANNUAL": {
      const day = d.getUTCDate();
      const month = d.getUTCMonth();
      d.setUTCDate(1);
      d.setUTCFullYear(d.getUTCFullYear() + 1);
      d.setUTCMonth(month);
      const lastDay = daysInMonth(d.getUTCFullYear(), month);
      d.setUTCDate(Math.min(day, lastDay));
      return d;
    }
    default:
      return d;
  }
}

function getRecurringOccurrencesInMonth(
  origin: Date,
  frequency: string,
  year: number,
  month: number
): Date[] {
  const monthStart = Date.UTC(year, month, 1);
  const monthEnd = Date.UTC(year, month + 1, 1); // exclusivo
  const occurrences: Date[] = [];

  let cursor = addPeriod(origin, frequency); // primera repetición (k=1)
  let iterations = 0;

  while (cursor.getTime() < monthEnd && iterations < MAX_ITERATIONS) {
    if (cursor.getTime() >= monthStart) {
      occurrences.push(new Date(cursor));
    }
    cursor = addPeriod(cursor, frequency);
    iterations++;
  }

  return occurrences;
}

/**
 * Devuelve todas las ocurrencias (reales + proyectadas) que caen dentro de
 * un mes dado. Una transacción recurrente que empezó en un mes anterior
 * aparece proyectada en los meses siguientes sin necesitar filas nuevas en
 * la base de datos.
 */
export function getMonthOccurrences(
  transactions: Transactions,
  year: number,
  month: number
): MonthOccurrence[] {
  const result: MonthOccurrence[] = [];

  for (const t of transactions) {
    const excluded = new Set(
      (t.excludedDates ?? []).map((d) => new Date(d).getTime())
    );

    const originDate = new Date(t.date);
    const originInMonth =
      originDate.getUTCFullYear() === year &&
      originDate.getUTCMonth() === month;

    if (originInMonth && !excluded.has(originDate.getTime())) {
      result.push({ date: originDate, transaction: t, projected: false });
    }

    if (t.isRecurring && t.recurrenceFrequency) {
      const occurrences = getRecurringOccurrencesInMonth(
        originDate,
        t.recurrenceFrequency,
        year,
        month
      );
      for (const occ of occurrences) {
        if (excluded.has(occ.getTime())) continue;
        result.push({ date: occ, transaction: t, projected: true });
      }
    }
  }

  return result;
}

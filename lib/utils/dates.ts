/**
 * Las fechas de Transaction se guardan como medianoche UTC (ver
 * features/transactions/actions.ts). Todo cálculo de calendario debe leer
 * con los accesores getUTC* — si se usan los locales, el día puede
 * desfasarse según la zona horaria del navegador/servidor.
 */

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** 0 = lunes ... 6 = domingo, para el primer día del mes. */
export function firstWeekdayOfMonth(year: number, month: number): number {
  const day = new Date(Date.UTC(year, month, 1)).getUTCDay(); // 0=dom..6=sab
  return (day + 6) % 7;
}

export function isSameUTCDay(date: Date, year: number, month: number, day: number) {
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month &&
    date.getUTCDate() === day
  );
}

export function addMonths(year: number, month: number, delta: number) {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/**
 * "Hoy" se compara en hora local (es el día que el usuario está viviendo
 * ahora mismo) — a diferencia de las transacciones, aquí no hay ningún
 * valor guardado/transmitido que pueda desfasarse.
 */
export function isToday(year: number, month: number, day: number) {
  const now = new Date();
  return (
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day
  );
}

"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui";
import {
  editOccurrenceAmountAction,
  type ActionState,
} from "@/features/transactions/actions";
import type { MonthOccurrence } from "@/features/transactions/recurrence";

interface DayOccurrenceRowProps {
  occurrence: MonthOccurrence;
}

const initialState: ActionState = {};

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DayOccurrenceRow({
  occurrence,
}: DayOccurrenceRowProps) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    editOccurrenceAmountAction,
    initialState
  );

  // onDone equivalente: cierra el modo edición al terminar con éxito. Es
  // estado local de este componente, así que se deriva en render en vez de
  // useEffect.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setEditing(false);
  }

  const { transaction, date, projected } = occurrence;
  const rowKey = `${transaction.id}-${date.getTime()}`;

  if (editing) {
    return (
      <li className="py-2.5 border-b border-slate-50 last:border-0">
        <form action={formAction} className="space-y-2">
          <input type="hidden" name="transactionId" value={transaction.id} />
          <input type="hidden" name="occurrenceDate" value={toISODate(date)} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 flex-1 truncate">
              {transaction.category.name}
            </span>
            <Input
              id={`occ-amount-${rowKey}`}
              name="amount"
              type="text"
              inputMode="decimal"
              pattern="^[0-9]+([.,][0-9]{1,2})?$"
              defaultValue={transaction.amount.toFixed(2)}
              size="sm"
              className="w-28"
              error={state.errors?.amount?.[0]}
            />
          </div>
          {transaction.isRecurring && (
            <p className="text-xs text-slate-400">
              Esto solo cambia el monto de este día — los demás meses de esta
              recurrencia no se ven afectados.
            </p>
          )}
          {state.message && (
            <p className="text-xs text-red-600" role="alert">
              {state.message}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 text-sm py-1">
      <span className="text-slate-600 min-w-0 truncate">
        {transaction.category.name}
        {projected && (
          <span className="ml-2 text-xs text-slate-400 italic">
            (proyectado)
          </span>
        )}
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={`font-semibold ${
            transaction.type === "INCOME" ? "text-emerald-600" : "text-red-600"
          } ${projected ? "opacity-60" : ""}`}
        >
          {transaction.type === "INCOME" ? "+" : "-"}$
          {transaction.amount.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label={`Editar monto de ${transaction.category.name} del ${toISODate(date)}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </li>
  );
}

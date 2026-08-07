"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui";
import {
  updateTransactionAction,
  type ActionState,
} from "@/features/transactions/actions";
import type { getCategories } from "@/features/transactions/queries";

const FREQUENCY_LABELS: Record<string, string> = {
  WEEKLY: "Semanal",
  BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual",
  ANNUAL: "Anual",
};

type Categories = Awaited<ReturnType<typeof getCategories>>["categories"];

interface EditTransactionRowProps {
  id: string;
  amount: number;
  date: Date;
  description: string | null;
  categoryId: string;
  isRecurring: boolean;
  recurrenceFrequency: string | null;
  categories: Categories;
  onDone: () => void;
  onCancel: () => void;
}

const initialState: ActionState = {};

export default function EditTransactionRow({
  id,
  amount,
  date,
  description,
  categoryId,
  isRecurring,
  recurrenceFrequency,
  categories,
  onDone,
  onCancel,
}: EditTransactionRowProps) {
  const [state, formAction, isPending] = useActionState(
    updateTransactionAction,
    initialState
  );

  // onDone() actualiza estado del componente padre (TransactionView), así
  // que a diferencia de un setState local, esto sí debe ir en un efecto.
  useEffect(() => {
    if (state.success) onDone();
  }, [state.success, onDone]);

  const dateValue = new Date(date).toISOString().slice(0, 10);

  return (
    <form
      action={formAction}
      className="py-3.5 rounded-xl bg-slate-50 border border-slate-200 px-3 space-y-3"
    >
      <input type="hidden" name="id" value={id} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Input
          id={`edit-amount-${id}`}
          name="amount"
          label="Monto"
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+([.,][0-9]{1,2})?$"
          defaultValue={amount.toFixed(2)}
          size="sm"
          error={state.errors?.amount?.[0]}
        />
        <Input
          id={`edit-date-${id}`}
          name="date"
          label="Fecha"
          type="date"
          defaultValue={dateValue}
          size="sm"
          error={state.errors?.date?.[0]}
        />
        <div className="col-span-2">
          <label
            htmlFor={`edit-category-${id}`}
            className="text-sm font-medium text-slate-700 mb-1.5 block"
          >
            Categoría
          </label>
          <select
            id={`edit-category-${id}`}
            name="categoryId"
            defaultValue={categoryId}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        id={`edit-description-${id}`}
        name="description"
        label="Descripción (opcional)"
        defaultValue={description ?? ""}
        size="sm"
      />

      <div className="space-y-2">
        <label className="flex items-center gap-2.5 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="isRecurring"
            defaultChecked={isRecurring}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Este movimiento se repite
          </span>
        </label>
        <select
          name="recurrenceFrequency"
          defaultValue={recurrenceFrequency ?? "MONTHLY"}
          className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {state.message && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

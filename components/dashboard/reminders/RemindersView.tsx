"use client";

import { useActionState, useState } from "react";
import { PageHeader, Input } from "@/components/ui";
import {
  createReminderAction,
  type ActionState,
} from "@/features/reminders/actions";
import ReminderRow from "./ReminderRow";
import type { getReminders } from "@/features/reminders/queries";

interface RemindersViewProps {
  reminders: Awaited<ReturnType<typeof getReminders>>;
}

const initialState: ActionState = {};

export default function RemindersView({ reminders }: RemindersViewProps) {
  const [state, formAction, isPending] = useActionState(
    createReminderAction,
    initialState
  );
  const [creating, setCreating] = useState(false);

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setCreating(false);
  }

  const pending = reminders.filter((r) => r.status === "PENDING");
  const paid = reminders.filter((r) => r.status === "PAID");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inverza"
        title="Recordatorios"
        description="Tus alertas de pago y fechas financieras importantes."
        actions={[
          creating
            ? undefined
            : {
                label: "+ Nuevo recordatorio",
                onClick: () => setCreating(true),
              },
        ]}
      />

      {creating && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <form action={formAction} className="space-y-4">
            <Input
              id="reminder-title"
              name="title"
              label="Título"
              placeholder="Ej: Pago de tarjeta de crédito"
              error={state.errors?.title?.[0]}
            />
            <Input
              id="reminder-description"
              name="description"
              label="Descripción (opcional)"
              placeholder="Ej: Corte el día 15"
            />
            <Input
              id="reminder-dueDate"
              name="dueDate"
              label="Fecha límite"
              type="date"
              error={state.errors?.dueDate?.[0]}
            />
            {state.message && (
              <p className="text-sm text-red-600" role="alert">
                {state.message}
              </p>
            )}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {isPending ? "Creando..." : "Crear recordatorio"}
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="py-2.5 px-6 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {reminders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <p className="text-sm text-slate-500">
            Todavía no tienes recordatorios. Creá el primero para no olvidar
            un pago importante.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
              Pendientes {pending.length > 0 ? `(${pending.length})` : ""}
            </h2>
            {pending.length === 0 ? (
              <p className="text-sm text-slate-500">
                No hay recordatorios pendientes.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pending.map((r) => (
                  <ReminderRow key={r.id} reminder={r} />
                ))}
              </ul>
            )}
          </div>

          {paid.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Pagados ({paid.length})
              </h2>
              <ul className="divide-y divide-slate-100">
                {paid.map((r) => (
                  <ReminderRow key={r.id} reminder={r} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

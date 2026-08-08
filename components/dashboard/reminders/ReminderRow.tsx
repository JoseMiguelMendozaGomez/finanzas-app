"use client";

import { useActionState, useState } from "react";
import { Input, ConfirmDialog } from "@/components/ui";
import {
  updateReminderAction,
  toggleReminderStatusAction,
  deleteReminderAction,
  type ActionState,
} from "@/features/reminders/actions";
import type { getReminders } from "@/features/reminders/queries";

type Reminder = Awaited<ReturnType<typeof getReminders>>[number];

interface ReminderRowProps {
  reminder: Reminder;
}

const initialState: ActionState = {};

function dueDateStatus(dueDate: Date, status: string) {
  if (status === "PAID") return { label: "Pagado", tone: "text-emerald-600 bg-emerald-50" };
  const now = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return { label: "Vencido", tone: "text-red-600 bg-red-50" };
  if (diffDays === 0) return { label: "Vence hoy", tone: "text-amber-600 bg-amber-50" };
  if (diffDays <= 7) return { label: `Vence en ${diffDays} día${diffDays === 1 ? "" : "s"}`, tone: "text-amber-600 bg-amber-50" };
  return { label: "Pendiente", tone: "text-slate-500 bg-slate-100" };
}

export default function ReminderRow({ reminder }: ReminderRowProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [togglePending, setTogglePending] = useState(false);

  const [state, formAction, isPending] = useActionState(
    updateReminderAction,
    initialState
  );

  // onDone equivalente (cerrar edición) toca solo estado local de este
  // componente, así que se deriva en render en vez de useEffect.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setEditing(false);
  }

  async function handleToggle() {
    setTogglePending(true);
    await toggleReminderStatusAction(reminder.id);
    setTogglePending(false);
  }

  async function handleConfirmDelete() {
    setDeletePending(true);
    await deleteReminderAction(reminder.id);
  }

  const status = dueDateStatus(reminder.dueDate, reminder.status);

  if (editing) {
    return (
      <li className="py-4">
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={reminder.id} />
          <Input
            id={`reminder-title-${reminder.id}`}
            name="title"
            label="Título"
            defaultValue={reminder.title}
            error={state.errors?.title?.[0]}
          />
          <Input
            id={`reminder-desc-${reminder.id}`}
            name="description"
            label="Descripción (opcional)"
            defaultValue={reminder.description ?? ""}
          />
          <Input
            id={`reminder-date-${reminder.id}`}
            name="dueDate"
            label="Fecha límite"
            type="date"
            defaultValue={new Date(reminder.dueDate).toISOString().slice(0, 10)}
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
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleToggle}
          disabled={togglePending}
          aria-label={
            reminder.status === "PAID"
              ? "Marcar como pendiente"
              : "Marcar como pagado"
          }
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
            reminder.status === "PAID"
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-300 hover:border-blue-400"
          }`}
        >
          {reminder.status === "PAID" && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              reminder.status === "PAID"
                ? "text-slate-400 line-through"
                : "text-slate-800"
            }`}
          >
            {reminder.title}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(reminder.dueDate).toLocaleDateString("es-PA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            })}
            {reminder.description ? ` · ${reminder.description}` : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${status.tone}`}>
          {status.label}
        </span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Editar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setConfirmDeleteOpen(true)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          aria-label="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="¿Eliminar este recordatorio?"
        description={`Se eliminará "${reminder.title}" permanentemente.`}
        confirmLabel="Eliminar"
        pending={deletePending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </li>
  );
}

"use client";

import { useActionState, useState } from "react";
import { Input, ConfirmDialog } from "@/components/ui";
import {
  contributeToGoalAction,
  withdrawFromGoalAction,
  updateGoalAction,
  deleteGoalAction,
  type ActionState,
} from "@/features/goals/actions";
import type { getGoals } from "@/features/goals/queries";

type Goal = Awaited<ReturnType<typeof getGoals>>[number];

interface GoalCardProps {
  goal: Goal;
}

const initialState: ActionState = {};

export default function GoalCard({ goal }: GoalCardProps) {
  const [mode, setMode] = useState<"view" | "contribute" | "withdraw" | "edit">(
    "view"
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const progress = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 100)
  );
  const achieved = goal.currentAmount >= goal.targetAmount;

  const [contribState, contributeAction, contributePending] = useActionState(
    contributeToGoalAction,
    initialState
  );
  const [withdrawState, withdrawAction, withdrawPending] = useActionState(
    withdrawFromGoalAction,
    initialState
  );
  const [editState, editAction, editPending] = useActionState(
    updateGoalAction,
    initialState
  );

  // Cierra el modo contribuir/retirar/editar cuando la Server Action termina
  // en éxito — mode es estado local, así que se deriva durante el render en
  // vez de un efecto (evita el re-render en cascada).
  const [handledContribState, setHandledContribState] = useState(contribState);
  if (contribState !== handledContribState) {
    setHandledContribState(contribState);
    if (contribState.success) setMode("view");
  }
  const [handledWithdrawState, setHandledWithdrawState] =
    useState(withdrawState);
  if (withdrawState !== handledWithdrawState) {
    setHandledWithdrawState(withdrawState);
    if (withdrawState.success) setMode("view");
  }
  const [handledEditState, setHandledEditState] = useState(editState);
  if (editState !== handledEditState) {
    setHandledEditState(editState);
    if (editState.success) setMode("view");
  }

  async function handleConfirmDelete() {
    setDeletePending(true);
    await deleteGoalAction(goal.id);
  }

  const deadlineLabel = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("es-PA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  if (mode === "edit") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <form action={editAction} className="space-y-3">
          <input type="hidden" name="id" value={goal.id} />
          <Input
            id={`edit-goal-name-${goal.id}`}
            name="name"
            label="Nombre de la meta"
            defaultValue={goal.name}
            error={editState.errors?.name?.[0]}
          />
          <Input
            id={`edit-goal-target-${goal.id}`}
            name="targetAmount"
            label="Monto objetivo"
            type="text"
            inputMode="decimal"
            pattern="^[0-9]+([.,][0-9]{1,2})?$"
            defaultValue={goal.targetAmount.toFixed(2)}
            error={editState.errors?.targetAmount?.[0]}
          />
          <Input
            id={`edit-goal-deadline-${goal.id}`}
            name="deadline"
            label="Fecha límite (opcional)"
            type="date"
            defaultValue={
              goal.deadline
                ? new Date(goal.deadline).toISOString().slice(0, 10)
                : ""
            }
          />
          {editState.message && (
            <p className="text-sm text-red-600" role="alert">
              {editState.message}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={editPending}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {editPending ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setMode("view")}
              className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {goal.name}
          </p>
          {deadlineLabel && (
            <p className="text-xs text-slate-400 mt-0.5">
              Fecha límite: {deadlineLabel}
            </p>
          )}
        </div>
        {achieved && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
            Completada
          </span>
        )}
      </div>

      <div className="mb-2">
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              achieved ? "bg-emerald-500" : "bg-blue-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            ${goal.currentAmount.toFixed(2)}
          </span>{" "}
          de ${goal.targetAmount.toFixed(2)}
        </p>
        <p className="text-xs text-slate-400">{progress}%</p>
      </div>

      {mode === "contribute" || mode === "withdraw" ? (
        <form
          action={mode === "contribute" ? contributeAction : withdrawAction}
          className="space-y-2"
        >
          <input type="hidden" name="goalId" value={goal.id} />
          <Input
            id={`${mode}-${goal.id}`}
            name="amount"
            label={mode === "contribute" ? "Monto a agregar" : "Monto a retirar"}
            type="text"
            inputMode="decimal"
            pattern="^[0-9]+([.,][0-9]{1,2})?$"
            placeholder="0.00"
            size="sm"
            error={
              mode === "contribute"
                ? contribState.errors?.amount?.[0]
                : withdrawState.errors?.amount?.[0]
            }
          />
          {mode === "contribute" && contribState.message && (
            <p className="text-xs text-red-600">{contribState.message}</p>
          )}
          {mode === "withdraw" && withdrawState.message && (
            <p className="text-xs text-red-600">{withdrawState.message}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={mode === "contribute" ? contributePending : withdrawPending}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {mode === "contribute"
                ? contributePending
                  ? "Agregando..."
                  : "Agregar"
                : withdrawPending
                  ? "Retirando..."
                  : "Retirar"}
            </button>
            <button
              type="button"
              onClick={() => setMode("view")}
              className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setMode("contribute")}
            className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
          >
            + Agregar fondos
          </button>
          <button
            type="button"
            onClick={() => setMode("withdraw")}
            disabled={goal.currentAmount <= 0}
            className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            − Retirar fondos
          </button>
          <button
            type="button"
            onClick={() => setMode("edit")}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Editar meta"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Eliminar meta"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="¿Eliminar esta meta?"
        description={`Se eliminará "${goal.name}" y perderás el registro de $${goal.currentAmount.toFixed(2)} ahorrados. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        pending={deletePending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}

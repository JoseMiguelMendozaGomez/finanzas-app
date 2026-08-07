"use client";

import { useActionState, useState } from "react";
import { PageHeader, Input } from "@/components/ui";
import { createGoalAction, type ActionState } from "@/features/goals/actions";
import GoalCard from "./GoalCard";
import type { getGoals } from "@/features/goals/queries";

interface GoalsViewProps {
  goals: Awaited<ReturnType<typeof getGoals>>;
}

const initialState: ActionState = {};

export default function GoalsView({ goals }: GoalsViewProps) {
  const [state, formAction, isPending] = useActionState(
    createGoalAction,
    initialState
  );
  const [creating, setCreating] = useState(false);

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setCreating(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inverza"
        title="Metas de ahorro"
        description="Define objetivos y sigue tu progreso hacia ellos."
        actions={[
          creating
            ? undefined
            : {
                label: "+ Nueva meta",
                onClick: () => setCreating(true),
              },
        ]}
      />

      {creating && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <form action={formAction} className="space-y-4">
            <Input
              id="goal-name"
              name="name"
              label="Nombre de la meta"
              placeholder="Ej: Fondo de emergencia"
              error={state.errors?.name?.[0]}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="goal-target"
                name="targetAmount"
                label="Monto objetivo"
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+([.,][0-9]{1,2})?$"
                placeholder="0.00"
                error={state.errors?.targetAmount?.[0]}
              />
              <Input
                id="goal-deadline"
                name="deadline"
                label="Fecha límite (opcional)"
                type="date"
              />
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
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {isPending ? "Creando..." : "Crear meta"}
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

      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <p className="text-sm text-slate-500">
            Todavía no tienes metas de ahorro. Creá la primera para empezar a
            seguirle el progreso.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}

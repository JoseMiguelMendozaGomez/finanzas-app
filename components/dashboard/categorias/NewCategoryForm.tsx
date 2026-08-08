"use client";

import { useActionState, useEffect, useState } from "react";
import { CategoryIcon } from "@/components/ui";
import {
  createCategoryAction,
  type ActionState,
} from "@/features/transactions/actions";
import {
  CATEGORY_ICON_NAMES,
  DEFAULT_CATEGORY_ICON,
  type CategoryIconName,
} from "@/features/transactions/default-categories";

interface NewCategoryFormProps {
  type: "INCOME" | "EXPENSE";
  onDone: () => void;
}

const initialState: ActionState = {};

export default function NewCategoryForm({
  type,
  onDone,
}: NewCategoryFormProps) {
  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    initialState
  );
  const [icon, setIcon] = useState<CategoryIconName>(DEFAULT_CATEGORY_ICON);

  // onDone() actualiza estado del componente padre (CategorySection), así
  // que a diferencia de un setState local, esto sí debe ir en un efecto.
  useEffect(() => {
    if (state.success) onDone();
  }, [state.success, onDone]);

  return (
    <form
      action={formAction}
      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
    >
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="icon" value={icon} />

      <p
        className={`text-xs font-semibold px-2.5 py-1 rounded-lg w-fit ${
          type === "INCOME"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        Nueva categoría de {type === "INCOME" ? "ingreso" : "gasto"}
      </p>

      <div className="flex items-center gap-3">
        <input
          type="color"
          name="color"
          defaultValue="#78406f"
          className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer shrink-0"
          aria-label="Color de la categoría"
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre de la categoría"
          autoFocus
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {state.errors?.name && (
        <p className="text-xs text-red-600">{state.errors.name[0]}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {CATEGORY_ICON_NAMES.map((iconName) => (
          <button
            key={iconName}
            type="button"
            onClick={() => setIcon(iconName)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${
              icon === iconName
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
            }`}
            aria-label={iconName}
          >
            <CategoryIcon name={iconName} className="w-4 h-4" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {isPending ? "Creando..." : "Crear categoría"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-xl transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

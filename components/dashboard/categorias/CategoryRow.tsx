"use client";

import { useActionState, useState } from "react";
import { CategoryIcon, ConfirmDialog } from "@/components/ui";
import {
  updateCategoryAction,
  deleteCategoryAction,
  changeCategoryTypeAction,
  type ActionState,
} from "@/features/transactions/actions";
import {
  CATEGORY_ICON_NAMES,
  type CategoryIconName,
} from "@/features/transactions/default-categories";

interface CategoryRowProps {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string | null;
  color: string | null;
  transactionCount: number;
}

const initialState: ActionState = {};

export default function CategoryRow({
  id,
  name,
  type,
  icon,
  color,
  transactionCount,
}: CategoryRowProps) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateCategoryAction,
    initialState
  );
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [changeTypeMessage, setChangeTypeMessage] = useState<string | null>(
    null
  );
  const [confirmChangeTypeOpen, setConfirmChangeTypeOpen] = useState(false);
  const [changeTypePending, setChangeTypePending] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<CategoryIconName>(
    (icon as CategoryIconName) ?? "other"
  );

  const otherType = type === "INCOME" ? "EXPENSE" : "INCOME";
  const otherTypeLabel = otherType === "INCOME" ? "ingreso" : "gasto";

  // Cierra el modo edición cuando la Server Action termina en éxito —
  // derivado durante el render (no en un efecto) para evitar el re-render
  // en cascada que useEffect + setState produciría.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setEditing(false);
  }

  async function handleDelete() {
    setDeleteMessage(null);
    const result = await deleteCategoryAction(id);
    if (result.message) setDeleteMessage(result.message);
  }

  async function handleConfirmChangeType() {
    setChangeTypePending(true);
    setChangeTypeMessage(null);
    const result = await changeCategoryTypeAction(id);
    setChangeTypePending(false);
    setConfirmChangeTypeOpen(false);
    if (result.message) setChangeTypeMessage(result.message);
  }

  if (editing) {
    return (
      <form
        action={formAction}
        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
      >
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="icon" value={selectedIcon} />

        <div className="flex items-center gap-3">
          <input
            type="color"
            name="color"
            defaultValue={color ?? "#78406f"}
            className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer shrink-0"
            aria-label="Color de la categoría"
          />
          <input
            type="text"
            name="name"
            defaultValue={name}
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
              onClick={() => setSelectedIcon(iconName)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${
                selectedIcon === iconName
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
    );
  }

  return (
    <div className="py-3 px-1">
      <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: color ? `${color}1a` : "#f1f5f9",
            color: color ?? "#64748b",
          }}
        >
          <CategoryIcon
            name={(icon as CategoryIconName) ?? "other"}
            className="w-4 h-4"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {name}
          </p>
          <p className="text-xs text-slate-400">
            {transactionCount === 0
              ? "Sin uso"
              : `${transactionCount} transacción${transactionCount === 1 ? "" : "es"}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setConfirmChangeTypeOpen(true)}
          title={`Mover a categorías de ${otherTypeLabel}`}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          aria-label={`Mover a categorías de ${otherTypeLabel}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Editar categoría"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={transactionCount > 0}
          title={
            transactionCount > 0
              ? "No se puede eliminar: tiene transacciones asociadas"
              : "Eliminar categoría"
          }
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed"
          aria-label="Eliminar categoría"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      </div>
      {deleteMessage && (
        <p className="text-xs text-red-600 mt-2">{deleteMessage}</p>
      )}
      {changeTypeMessage && (
        <p className="text-xs text-red-600 mt-2">{changeTypeMessage}</p>
      )}

      <ConfirmDialog
        open={confirmChangeTypeOpen}
        title={`¿Mover "${name}" a categorías de ${otherTypeLabel}?`}
        description={
          transactionCount > 0
            ? `Dejará de aparecer entre las categorías de ${
                type === "INCOME" ? "ingresos" : "gastos"
              } y solo estará disponible al registrar un ${otherTypeLabel}. Sus ${transactionCount} transacción${transactionCount === 1 ? "" : "es"} también cambiará${transactionCount === 1 ? "" : "n"} a tipo ${otherTypeLabel}.`
            : `Dejará de aparecer entre las categorías de ${
                type === "INCOME" ? "ingresos" : "gastos"
              } y solo estará disponible al registrar un ${otherTypeLabel}.`
        }
        confirmLabel="Mover"
        danger={false}
        pending={changeTypePending}
        onConfirm={handleConfirmChangeType}
        onCancel={() => setConfirmChangeTypeOpen(false)}
      />
    </div>
  );
}

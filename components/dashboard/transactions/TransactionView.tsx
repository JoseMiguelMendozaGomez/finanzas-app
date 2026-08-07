"use client";

import { useActionState, useState } from "react";
import { PageHeader, Input, CategoryIcon } from "@/components/ui";
import {
  createTransactionAction,
  deleteTransactionAction,
  type ActionState,
} from "@/features/transactions/actions";
import {
  DEFAULT_CATEGORY_ICON,
  CATEGORY_ICON_NAMES,
  type CategoryIconName,
} from "@/features/transactions/default-categories";
import type {
  getCategories,
  getTransactionsByType,
} from "@/features/transactions/queries";
import EditTransactionRow from "./EditTransactionRow";

const FREQUENCY_LABELS: Record<string, string> = {
  WEEKLY: "Semanal",
  BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual",
  ANNUAL: "Anual",
};

type Categories = Awaited<ReturnType<typeof getCategories>>;
type Transactions = Awaited<ReturnType<typeof getTransactionsByType>>;

interface TransactionViewProps {
  type: "INCOME" | "EXPENSE";
  categories: Categories["categories"];
  suggestions: Categories["suggestions"];
  transactions: Transactions;
  total: number;
  onBack: () => void;
}

const initialState: ActionState = {};

type Selection =
  | { mode: "existing"; categoryId: string }
  | { mode: "new"; name: string; icon: CategoryIconName };

const COPY = {
  INCOME: {
    title: "Ingresos",
    submitLabel: "Registrar ingreso",
    submitPending: "Guardando...",
    emptyList: "Todavía no has registrado ningún ingreso.",
    amountColor: "text-emerald-600",
    iconBg: "bg-emerald-50 text-emerald-600",
    sign: "+",
  },
  EXPENSE: {
    title: "Gastos",
    submitLabel: "Registrar gasto",
    submitPending: "Guardando...",
    emptyList: "Todavía no has registrado ningún gasto.",
    amountColor: "text-red-600",
    iconBg: "bg-red-50 text-red-600",
    sign: "-",
  },
} as const;

export default function TransactionView({
  type,
  categories,
  suggestions,
  transactions,
  total,
  onBack,
}: TransactionViewProps) {
  const copy = COPY[type];
  const boundCreateAction = createTransactionAction.bind(null, type);
  const [state, formAction, isPending] = useActionState(
    boundCreateAction,
    initialState
  );
  const [selection, setSelection] = useState<Selection | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIcon, setCustomIcon] = useState<CategoryIconName>(
    DEFAULT_CATEGORY_ICON
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
          aria-label="Volver al resumen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <PageHeader
          eyebrow="Finanzas App"
          title={copy.title}
          description={`Total registrado: $${total.toFixed(2)}`}
        />
      </div>

      {/* Formulario */}
      <form
        action={formAction}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6"
      >
        <input
          type="hidden"
          name="categoryId"
          value={selection?.mode === "existing" ? selection.categoryId : ""}
          readOnly
        />
        <input
          type="hidden"
          name="newCategoryName"
          value={selection?.mode === "new" ? selection.name : ""}
          readOnly
        />
        <input
          type="hidden"
          name="newCategoryIcon"
          value={selection?.mode === "new" ? selection.icon : ""}
          readOnly
        />

        {/* Selector de categoría */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Categoría
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active =
                selection?.mode === "existing" &&
                selection.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelection({ mode: "existing", categoryId: cat.id })
                  }
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CategoryIcon
                    name={(cat.icon as CategoryIconName) ?? "other"}
                    className="w-4 h-4"
                  />
                  {cat.name}
                </button>
              );
            })}

            {suggestions.map((sug) => {
              const active =
                selection?.mode === "new" && selection.name === sug.name;
              return (
                <button
                  key={sug.name}
                  type="button"
                  onClick={() =>
                    setSelection({
                      mode: "new",
                      name: sug.name,
                      icon: sug.icon,
                    })
                  }
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <CategoryIcon name={sug.icon} className="w-4 h-4" />
                  {sug.name}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCustomOpen((v) => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed text-sm font-medium transition-colors ${
                customOpen
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"
              }`}
            >
              + Otra categoría
            </button>
          </div>

          {customOpen && (
            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <p
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg w-fit ${
                  type === "INCOME"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                Se creará como categoría de {type === "INCOME" ? "ingreso" : "gasto"}
              </p>
              <Input
                id="custom-category-name"
                label="Nombre de la categoría"
                placeholder='Ej: "Dinero prestado"'
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  setSelection({
                    mode: "new",
                    name: e.target.value,
                    icon: customIcon,
                  });
                }}
              />
              <div>
                <span className="text-xs font-medium text-slate-500 mb-1.5 block">
                  Ícono (opcional — si no eliges uno se usa el ícono por
                  defecto)
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_ICON_NAMES.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        setCustomIcon(icon);
                        if (customName) {
                          setSelection({
                            mode: "new",
                            name: customName,
                            icon,
                          });
                        }
                      }}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${
                        customIcon === icon
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                      aria-label={icon}
                    >
                      <CategoryIcon name={icon} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {state.errors?.categoryId && (
            <p className="text-xs text-red-600 mt-1.5">
              {state.errors.categoryId[0]}
            </p>
          )}
        </div>

        {/* Monto + fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="amount"
            name="amount"
            label="Monto"
            type="text"
            inputMode="decimal"
            pattern="^[0-9]+([.,][0-9]{1,2})?$"
            placeholder="0.00"
            error={state.errors?.amount?.[0]}
          />
          <Input
            id="date"
            name="date"
            label="Fecha"
            type="date"
            error={state.errors?.date?.[0]}
          />
        </div>

        <Input
          id="description"
          name="description"
          label="Descripción (opcional)"
          placeholder={type === "INCOME" ? "Ej: Pago de quincena" : "Ej: Supermercado"}
        />

        {/* Recurrencia */}
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <input
              type="checkbox"
              name="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Este {type === "INCOME" ? "ingreso" : "gasto"} se repite
            </span>
          </label>

          {isRecurring && (
            <div className="max-w-xs">
              <label
                htmlFor="recurrenceFrequency"
                className="text-xs font-medium text-slate-500 mb-1.5 block"
              >
                Frecuencia
              </label>
              <select
                id="recurrenceFrequency"
                name="recurrenceFrequency"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                defaultValue="MONTHLY"
              >
                {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {state.errors?.recurrenceFrequency && (
                <p className="text-xs text-red-600 mt-1.5">
                  {state.errors.recurrenceFrequency[0]}
                </p>
              )}
            </div>
          )}
        </div>

        {state.message && (
          <p className="text-sm text-red-600" role="alert">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? copy.submitPending : copy.submitLabel}
        </button>
      </form>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-5">
          Historial de {type === "INCOME" ? "ingresos" : "gastos"}
        </h2>

        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500">{copy.emptyList}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.map((t) =>
              editingId === t.id ? (
                <li key={t.id} className="py-3">
                  <EditTransactionRow
                    id={t.id}
                    amount={t.amount}
                    date={t.date}
                    description={t.description}
                    categoryId={t.categoryId}
                    isRecurring={t.isRecurring}
                    recurrenceFrequency={t.recurrenceFrequency}
                    categories={categories}
                    onDone={() => setEditingId(null)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
                <li
                  key={t.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${copy.iconBg}`}
                    >
                      <CategoryIcon
                        name={(t.category.icon as CategoryIconName) ?? "other"}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {t.category.name}
                        {t.isRecurring && (
                          <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {t.recurrenceFrequency
                              ? FREQUENCY_LABELS[t.recurrenceFrequency]
                              : "Recurrente"}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(t.date).toLocaleDateString("es-PA", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                        {t.description ? ` · ${t.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-sm font-semibold ${copy.amountColor}`}>
                      {copy.sign}${t.amount.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingId(t.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      aria-label="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTransactionAction(t.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

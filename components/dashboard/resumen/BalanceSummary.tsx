interface BalanceSummaryProps {
  income: number;
  expense: number;
  monthLabel: string;
}

export default function BalanceSummary({
  income,
  expense,
  monthLabel,
}: BalanceSummaryProps) {
  const balance = income - expense;
  const balanceColor =
    balance > 0
      ? "text-emerald-600"
      : balance < 0
        ? "text-red-600"
        : "text-slate-600";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Balance de {monthLabel}
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Ingresos</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-600">
            ${income.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Gastos</p>
          <p className="text-lg sm:text-xl font-bold text-red-600">
            ${expense.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Balance</p>
          <p className={`text-lg sm:text-xl font-bold ${balanceColor}`}>
            {balance < 0 ? "-" : ""}${Math.abs(balance).toFixed(2)}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4">
        Incluye ingresos y gastos recurrentes proyectados para este mes.
      </p>
    </div>
  );
}

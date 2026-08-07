"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import CategoryRow from "./CategoryRow";
import NewCategoryForm from "./NewCategoryForm";
import type { getAllCategoriesWithCounts } from "@/features/transactions/queries";

type Categories = Awaited<ReturnType<typeof getAllCategoriesWithCounts>>;

interface CategoriesViewProps {
  categories: Categories;
}

function CategorySection({
  title,
  type,
  categories,
}: {
  title: string;
  type: "INCOME" | "EXPENSE";
  categories: Categories;
}) {
  const [addingNew, setAddingNew] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
          {title}
        </h2>
        {!addingNew && (
          <button
            type="button"
            onClick={() => setAddingNew(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            + Nueva categoría de {type === "INCOME" ? "ingreso" : "gasto"}
          </button>
        )}
      </div>

      {addingNew && (
        <div className="mb-4">
          <NewCategoryForm type={type} onDone={() => setAddingNew(false)} />
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-sm text-slate-400">
          Todavía no tienes categorías de {title.toLowerCase()}.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {categories.map((cat) => (
            <CategoryRow
              key={cat.id}
              id={cat.id}
              name={cat.name}
              type={cat.type}
              icon={cat.icon}
              color={cat.color}
              transactionCount={cat._count.transactions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesView({ categories }: CategoriesViewProps) {
  const income = categories.filter((c) => c.type === "INCOME");
  const expense = categories.filter((c) => c.type === "EXPENSE");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finanzas App"
        title="Categorías"
        description="Organiza y personaliza las categorías de tus ingresos y gastos."
      />

      <CategorySection title="Ingresos" type="INCOME" categories={income} />
      <CategorySection title="Gastos" type="EXPENSE" categories={expense} />
    </div>
  );
}

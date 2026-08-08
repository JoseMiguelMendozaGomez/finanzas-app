export type CategoryIconName =
  | "salary"
  | "bonus"
  | "thirteenth"
  | "voucher"
  | "loan"
  | "food"
  | "transport"
  | "home"
  | "utilities"
  | "entertainment"
  | "health"
  | "other";

export interface DefaultCategory {
  name: string;
  icon: CategoryIconName;
  color: string;
}

export const DEFAULT_INCOME_CATEGORIES: DefaultCategory[] = [
  { name: "Salario", icon: "salary", color: "#5b3358" },
  { name: "Décimo", icon: "thirteenth", color: "#78406f" },
  { name: "Aguinaldo", icon: "bonus", color: "#97588d" },
  { name: "Bono", icon: "bonus", color: "#7a8b6f" },
  { name: "Vale", icon: "voucher", color: "#b3906a" },
];

export const DEFAULT_EXPENSE_CATEGORIES: DefaultCategory[] = [
  { name: "Comida", icon: "food", color: "#b5533d" },
  { name: "Transporte", icon: "transport", color: "#7d7568" },
  { name: "Vivienda", icon: "home", color: "#5b3358" },
  { name: "Servicios", icon: "utilities", color: "#78406f" },
  { name: "Entretenimiento", icon: "entertainment", color: "#97588d" },
  { name: "Salud", icon: "health", color: "#b3906a" },
];

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "other";

export function getDefaultCategories(
  type: "INCOME" | "EXPENSE"
): DefaultCategory[] {
  return type === "INCOME"
    ? DEFAULT_INCOME_CATEGORIES
    : DEFAULT_EXPENSE_CATEGORIES;
}

export const CATEGORY_ICON_NAMES: CategoryIconName[] = [
  "salary",
  "bonus",
  "thirteenth",
  "voucher",
  "loan",
  "food",
  "transport",
  "home",
  "utilities",
  "entertainment",
  "health",
  "other",
];

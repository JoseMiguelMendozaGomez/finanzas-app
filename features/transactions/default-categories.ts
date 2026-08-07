export interface DefaultCategory {
  name: string;
  icon: CategoryIconName;
  color: string;
}

export type CategoryIconName =
  | "salary"
  | "bonus"
  | "thirteenth"
  | "voucher"
  | "loan"
  | "other";

export const DEFAULT_INCOME_CATEGORIES: DefaultCategory[] = [
  { name: "Salario", icon: "salary", color: "#5b3358" },
  { name: "Décimo", icon: "thirteenth", color: "#78406f" },
  { name: "Aguinaldo", icon: "bonus", color: "#97588d" },
  { name: "Bono", icon: "bonus", color: "#7a8b6f" },
  { name: "Vale", icon: "voucher", color: "#b3906a" },
];

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "other";

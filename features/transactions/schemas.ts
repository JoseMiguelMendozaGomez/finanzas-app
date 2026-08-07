import { z } from "zod";

const CATEGORY_ICON_NAMES = [
  "salary",
  "bonus",
  "thirteenth",
  "voucher",
  "loan",
  "other",
] as const;

const RECURRENCE_FREQUENCIES = [
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "ANNUAL",
] as const;

export const createIncomeSchema = z
  .object({
    amount: z.coerce
      .number({ message: "Ingresa un monto válido" })
      .positive("El monto debe ser mayor a 0"),
    date: z.string().min(1, "Selecciona una fecha"),
    description: z.string().trim().max(200).optional().or(z.literal("")),
    categoryId: z.string().optional(),
    newCategoryName: z.string().trim().min(2).max(40).optional(),
    newCategoryIcon: z.enum(CATEGORY_ICON_NAMES).optional(),
    isRecurring: z.coerce.boolean().default(false),
    recurrenceFrequency: z.enum(RECURRENCE_FREQUENCIES).optional(),
  })
  .refine((data) => data.categoryId || data.newCategoryName, {
    message: "Selecciona o crea una categoría",
    path: ["categoryId"],
  })
  .refine((data) => !data.isRecurring || data.recurrenceFrequency, {
    message: "Selecciona la frecuencia de recurrencia",
    path: ["recurrenceFrequency"],
  });

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;

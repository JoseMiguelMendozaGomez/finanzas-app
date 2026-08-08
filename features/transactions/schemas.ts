import { z } from "zod";
import { CATEGORY_ICON_NAMES } from "./default-categories";

const ICON_NAMES = CATEGORY_ICON_NAMES as [string, ...string[]];

const RECURRENCE_FREQUENCIES = [
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "ANNUAL",
] as const;

const amountSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.replace(",", ".") : val),
  z.coerce
    .number({ message: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0")
);

export const createTransactionSchema = z
  .object({
    amount: amountSchema,
    date: z.string().min(1, "Selecciona una fecha"),
    description: z.string().trim().max(200).optional().or(z.literal("")),
    categoryId: z.string().optional(),
    newCategoryName: z.string().trim().min(2).max(40).optional(),
    newCategoryIcon: z.enum(ICON_NAMES).optional(),
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

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z
  .object({
    id: z.string().min(1),
    amount: amountSchema,
    date: z.string().min(1, "Selecciona una fecha"),
    description: z.string().trim().max(200).optional().or(z.literal("")),
    categoryId: z.string().min(1, "Selecciona una categoría"),
    isRecurring: z.coerce.boolean().default(false),
    recurrenceFrequency: z.enum(RECURRENCE_FREQUENCIES).optional(),
  })
  .refine((data) => !data.isRecurring || data.recurrenceFrequency, {
    message: "Selecciona la frecuencia de recurrencia",
    path: ["recurrenceFrequency"],
  });

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(40),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.enum(ICON_NAMES).optional(),
  color: z.string().trim().max(20).optional(),
});

export const editOccurrenceSchema = z.object({
  transactionId: z.string().min(1),
  occurrenceDate: z.string().min(1),
  amount: amountSchema,
});

export const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(40),
  icon: z.enum(ICON_NAMES),
  color: z.string().trim().max(20).optional(),
});

import { z } from "zod";

const amountSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.replace(",", ".") : val),
  z.coerce
    .number({ message: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0")
);

export const createGoalSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto").max(60),
  targetAmount: amountSchema,
  deadline: z.string().optional().or(z.literal("")),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "El nombre es muy corto").max(60),
  targetAmount: amountSchema,
  deadline: z.string().optional().or(z.literal("")),
});

export const contributeSchema = z.object({
  goalId: z.string().min(1),
  amount: amountSchema,
});

export const withdrawSchema = z.object({
  goalId: z.string().min(1),
  amount: amountSchema,
});

import { z } from "zod";

export const createReminderSchema = z.object({
  title: z.string().trim().min(2, "El título es muy corto").max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  dueDate: z.string().min(1, "Selecciona una fecha"),
});

export const updateReminderSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2, "El título es muy corto").max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  dueDate: z.string().min(1, "Selecciona una fecha"),
});

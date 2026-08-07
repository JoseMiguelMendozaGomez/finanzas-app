"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { updateProfileSchema } from "./schemas";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { message: "Tu sesión expiró. Inicia sesión de nuevo." };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
  });

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/home");
  return { success: true };
}

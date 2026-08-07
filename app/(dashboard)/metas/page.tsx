import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { getGoals } from "@/features/goals/queries";
import GoalsView from "@/components/dashboard/goals/GoalsView";

export const metadata: Metadata = {
  title: "Metas de ahorro — Inverza",
  description: "Define y sigue el progreso de tus objetivos de ahorro.",
};

export default async function MetasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const goals = await getGoals(session.user.id);

  return <GoalsView goals={goals} />;
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { getReminders } from "@/features/reminders/queries";
import RemindersView from "@/components/dashboard/reminders/RemindersView";

export const metadata: Metadata = {
  title: "Recordatorios — Finanzas App",
  description: "Gestiona tus recordatorios de pago y fechas importantes.",
};

export default async function RecordatoriosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reminders = await getReminders(session.user.id);

  return <RemindersView reminders={reminders} />;
}

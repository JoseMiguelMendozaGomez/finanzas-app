import type { Metadata } from "next";
import UnderConstruction from "@/components/dashboard/UnderConstruction";

export const metadata: Metadata = {
  title: "Recordatorios — Finanzas App",
  description: "Gestiona tus recordatorios de pago y fechas importantes.",
};

export default function RecordatoriosPage() {
  return (
    <UnderConstruction
      title="Recordatorios"
      description="Tus alertas de pago y fechas financieras importantes"
      icon="reminders"
      color="amber"
    />
  );
}

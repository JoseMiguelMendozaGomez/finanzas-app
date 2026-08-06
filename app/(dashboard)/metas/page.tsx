import type { Metadata } from "next";
import UnderConstruction from "@/components/dashboard/UnderConstruction";

export const metadata: Metadata = {
  title: "Metas de ahorro — Finanzas App",
  description: "Define y sigue el progreso de tus objetivos de ahorro.",
};

export default function MetasPage() {
  return (
    <UnderConstruction
      title="Metas de ahorro"
      description="Tus objetivos financieros con seguimiento visual de progreso"
      icon="goals"
      color="blue"
    />
  );
}

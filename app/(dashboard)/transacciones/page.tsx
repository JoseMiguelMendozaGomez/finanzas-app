import type { Metadata } from "next";
import UnderConstruction from "@/components/dashboard/UnderConstruction";

export const metadata: Metadata = {
  title: "Transacciones — Finanzas App",
  description: "Registra y consulta tus ingresos y gastos.",
};

export default function TransaccionesPage() {
  return (
    <UnderConstruction
      title="Transacciones"
      description="Tus ingresos y gastos registrados con filtros, búsqueda y exportación"
      icon="transactions"
      color="emerald"
    />
  );
}

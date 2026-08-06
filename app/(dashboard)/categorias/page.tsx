import type { Metadata } from "next";
import UnderConstruction from "@/components/dashboard/UnderConstruction";

export const metadata: Metadata = {
  title: "Categorías — Finanzas App",
  description: "Organiza tus transacciones por categorías personalizadas.",
};

export default function CategoriasPage() {
  return (
    <UnderConstruction
      title="Categorías"
      description="Las categorías con las que clasificas tus transacciones"
      icon="categories"
      color="violet"
    />
  );
}

import type { Metadata } from "next";
import UnderConstruction from "@/components/dashboard/UnderConstruction";

export const metadata: Metadata = {
  title: "Perfil — Finanzas App",
  description: "Administra tu cuenta y preferencias.",
};

export default function PerfilPage() {
  return (
    <UnderConstruction
      title="Perfil"
      description="Tu cuenta, preferencias y configuración personal"
      icon="profile"
      color="blue"
    />
  );
}

import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta — Finanzas App",
  description:
    "Crea tu cuenta gratuita en Finanzas App y empieza a controlar tus finanzas.",
};

export default function RegistroPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta gratis"
      subtitle="Empieza a controlar tus finanzas en minutos"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

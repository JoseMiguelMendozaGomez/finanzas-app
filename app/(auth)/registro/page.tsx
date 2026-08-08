import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta — Inverza",
  description:
    "Crea tu cuenta gratuita en Inverza y empieza a controlar tus finanzas.",
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

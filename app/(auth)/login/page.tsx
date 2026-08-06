import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — Finanzas App",
  description: "Accede a tu cuenta de Finanzas App.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus datos para acceder a tu cuenta"
    >
      <LoginForm />
    </AuthLayout>
  );
}

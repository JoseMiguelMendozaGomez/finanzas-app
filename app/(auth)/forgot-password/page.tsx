import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña — Inverza",
  description: "Te enviamos un enlace para restablecer tu contraseña.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="¿Olvidaste tu contraseña?"
      subtitle="Ingresá tu correo y te mandamos un enlace para restablecerla"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

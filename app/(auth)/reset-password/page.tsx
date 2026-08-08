import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Restablecer contraseña — Inverza",
  description: "Elegí una nueva contraseña para tu cuenta.",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthLayout
        title="Enlace inválido"
        subtitle="Este enlace de recuperación no tiene un token válido"
      >
        <p className="text-sm text-slate-600 text-center">
          Solicitá un nuevo enlace desde{" "}
          <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
            ¿Olvidaste tu contraseña?
          </a>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Restablecer contraseña"
      subtitle="Elegí una nueva contraseña para tu cuenta"
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

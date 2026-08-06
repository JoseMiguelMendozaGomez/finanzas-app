"use client";

import Link from "next/link";
import FormField from "@/components/ui/FormField";

export default function LoginForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Sin lógica de backend por ahora
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
        />

        <FormField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          labelSuffix={
            <Link
              href="/forgot-password"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          }
        />

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer mt-2"
        >
          Iniciar sesión
        </button>
      </form>

      {/* Footer del card */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-slate-400 text-sm">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/registro"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Crear una cuenta
          </Link>
        </p>
      </div>
    </>
  );
}

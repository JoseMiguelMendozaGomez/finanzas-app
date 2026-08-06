"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";

export default function RegisterForm() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Sin lógica de backend — navega directamente al home
    router.push("/home");
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          id="name"
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
        />

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
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
        />

        <FormField
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer mt-2"
        >
          Crear cuenta
        </button>
      </form>

      {/* Footer del card */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-slate-400 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Ya tengo una cuenta
          </Link>
        </p>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import FormField from "@/components/ui/FormField";
import { registerAction, type ActionState } from "@/features/auth/actions";

const initialState: ActionState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <>
      <form className="space-y-5" action={formAction}>
        <FormField
          id="name"
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
          error={state.errors?.name?.[0]}
        />

        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          error={state.errors?.email?.[0]}
        />

        <FormField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres, con letra y número"
          autoComplete="new-password"
          error={state.errors?.password?.[0]}
        />

        <FormField
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          error={state.errors?.confirmPassword?.[0]}
        />

        {state.message && (
          <p className="text-sm text-red-600" role="alert">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      {/* Footer del card */}
      <div className="mt-6 pt-6 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Ya tengo una cuenta
          </Link>
        </p>
      </div>
    </>
  );
}

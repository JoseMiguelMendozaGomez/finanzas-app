"use client";

import Link from "next/link";
import { useActionState } from "react";
import FormField from "@/components/ui/FormField";
import { loginAction, type ActionState } from "@/features/auth/actions";

const initialState: ActionState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <>
      <form className="space-y-5" action={formAction}>
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
          placeholder="••••••••"
          autoComplete="current-password"
          error={state.errors?.password?.[0]}
          labelSuffix={
            <Link
              href="/forgot-password"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          }
        />

        {state.message && (
          <p className="text-sm text-red-400" role="alert">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Ingresando..." : "Iniciar sesión"}
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

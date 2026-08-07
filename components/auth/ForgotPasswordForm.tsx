"use client";

import Link from "next/link";
import { useActionState } from "react";
import FormField from "@/components/ui/FormField";
import {
  requestPasswordResetAction,
  type ActionState,
} from "@/features/auth/actions";

const initialState: ActionState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState
  );

  if (state.success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-slate-600">{state.message}</p>
        <Link
          href="/login"
          className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" action={formAction}>
      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@correo.com"
        autoComplete="email"
        error={state.errors?.email?.[0]}
      />

      {state.message && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Enviando..." : "Enviar enlace de recuperación"}
      </button>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </form>
  );
}

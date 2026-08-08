"use client";

import Link from "next/link";
import { useActionState } from "react";
import FormField from "@/components/ui/FormField";
import {
  resetPasswordAction,
  type ActionState,
} from "@/features/auth/actions";

interface ResetPasswordFormProps {
  token: string;
}

const initialState: ActionState = {};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState
  );

  if (state.success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-slate-600">
          Tu contraseña se actualizó correctamente.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" action={formAction}>
      <input type="hidden" name="token" value={token} />

      <FormField
        id="password"
        label="Nueva contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres, con letra y número"
        autoComplete="new-password"
        error={state.errors?.password?.[0]}
      />

      <FormField
        id="confirmPassword"
        label="Confirmar nueva contraseña"
        type="password"
        placeholder="••••••••"
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
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Guardando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
}

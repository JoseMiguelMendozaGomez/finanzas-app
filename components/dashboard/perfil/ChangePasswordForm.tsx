"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui";
import {
  changePasswordAction,
  type ActionState,
} from "@/features/profile/actions";

const initialState: ActionState = {};

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );
  // Limpia los campos después de un cambio exitoso — se fuerza un remount
  // del <form> cambiando su key, ya que son inputs no controlados.
  const [formKey, setFormKey] = useState(0);

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setFormKey((k) => k + 1);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-800">
          Cambiar contraseña
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Necesitás tu contraseña actual para poner una nueva.
        </p>
      </div>
      <form key={formKey} action={formAction} className="space-y-4 max-w-sm">
        <Input
          id="currentPassword"
          name="currentPassword"
          label="Contraseña actual"
          type="password"
          autoComplete="current-password"
          error={state.errors?.currentPassword?.[0]}
        />
        <Input
          id="newPassword"
          name="newPassword"
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres, con letra y número"
          error={state.errors?.newPassword?.[0]}
        />
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          label="Confirmar nueva contraseña"
          type="password"
          autoComplete="new-password"
          error={state.errors?.confirmNewPassword?.[0]}
        />
        {state.message && (
          <p className="text-sm text-red-600" role="alert">
            {state.message}
          </p>
        )}
        {state.success && (
          <p className="text-sm text-emerald-600">Contraseña actualizada.</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {isPending ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}

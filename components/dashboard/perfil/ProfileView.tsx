"use client";

import { useActionState, useState } from "react";
import { PageHeader, Input } from "@/components/ui";
import { getInitial } from "@/lib/utils/format";
import {
  updateProfileAction,
  type ActionState,
} from "@/features/profile/actions";

interface ProfileViewProps {
  name: string | null;
  email: string;
  memberSince: Date;
}

const initialState: ActionState = {};

export default function ProfileView({
  name,
  email,
  memberSince,
}: ProfileViewProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );
  // Refleja el nombre recién guardado en el avatar de esta misma página sin
  // esperar a un refetch del servidor.
  const [savedName, setSavedName] = useState(name);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finanzas App"
        title="Perfil"
        description="Tu cuenta y cómo queres que te llamemos."
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-2xl font-bold">
              {getInitial(savedName, email)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-slate-900 truncate">
              {savedName || "Sin nombre"}
            </p>
            <p className="text-sm text-slate-500 truncate">{email}</p>
          </div>
        </div>

        <form
          action={(formData) => {
            const value = formData.get("name");
            if (typeof value === "string") setSavedName(value);
            formAction(formData);
          }}
          className="space-y-4 max-w-sm"
        >
          <Input
            id="name"
            name="name"
            label="Nombre para mostrar"
            defaultValue={name ?? ""}
            placeholder="Ej: José"
            hint="Así te vamos a saludar en tu dashboard."
            error={state.errors?.name?.[0]}
          />
          {state.message && (
            <p className="text-sm text-red-600" role="alert">
              {state.message}
            </p>
          )}
          {state.success && (
            <p className="text-sm text-emerald-600">Guardado.</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Miembro desde{" "}
            {memberSince.toLocaleDateString("es-PA", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

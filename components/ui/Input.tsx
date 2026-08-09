"use client";

import { useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type InputSize = "sm" | "md" | "lg";
export type InputTheme = "light" | "dark";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** id del input — también se usa como htmlFor del label */
  id: string;
  label?: string;
  /** Texto de ayuda bajo el campo */
  hint?: string;
  /** Mensaje de error — activa estilos de error */
  error?: string;
  /** Icono a la izquierda dentro del campo */
  iconLeft?: React.ReactNode;
  /** Elemento a la derecha dentro del campo (icono, botón, texto) */
  iconRight?: React.ReactNode;
  /** Slot a la derecha del label (ej: enlace "¿Olvidaste tu contraseña?") */
  labelSuffix?: React.ReactNode;
  size?: InputSize;
  /**
   * "light" → fondo blanco, texto oscuro (dashboard, formularios internos)
   * "dark"  → fondo semitransparente, texto blanco (auth pages)
   */
  theme?: InputTheme;
}

// ─── Tokens de estilo ─────────────────────────────────────────────────────────

const sizeClasses: Record<InputSize, { input: string; icon: string }> = {
  sm: { input: "py-2 text-sm",    icon: "w-4 h-4" },
  md: { input: "py-2.5 text-sm",  icon: "w-4 h-4" },
  lg: { input: "py-3 text-base",  icon: "w-5 h-5" },
};

const themeBase: Record<InputTheme, string> = {
  light:
    "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 " +
    "focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300",
  dark:
    "bg-white/5 border-white/10 text-white placeholder:text-slate-500 " +
    "focus:ring-blue-500 focus:border-transparent",
};

const themeError: Record<InputTheme, string> = {
  light: "border-red-400 focus:ring-red-500 focus:border-red-400",
  dark:  "border-red-400/60 focus:ring-red-500",
};

// ─── Ícono de mostrar/ocultar contraseña ───────────────────────────────────────
// Nativo del navegador (Safari/Chrome lo dibujan solos) pero atado al foco del
// campo — desaparece al enfocar otro elemento (ej. el checkbox "Recordarme").
// Uno propio, controlado por React, evita esa inconsistencia entre navegadores.

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3l18 18M10.584 10.587a3 3 0 004.243 4.243M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.523 10.523 0 01-1.985 3.522M6.423 6.423C4.462 7.63 2.983 9.607 2.458 12c.633 2.02 1.923 3.775 3.615 5.014" />
    </svg>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Input({
  id,
  label,
  hint,
  error,
  iconLeft,
  iconRight,
  labelSuffix,
  size = "md",
  theme = "light",
  className = "",
  type,
  ...rest
}: InputProps) {
  const s = sizeClasses[size];
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  const effectiveType = isPassword ? (revealed ? "text" : "password") : type;
  const effectiveIconRight =
    isPassword && !iconRight ? (
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="pointer-events-auto text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={revealed ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {revealed ? <EyeOffIcon className={s.icon} /> : <EyeIcon className={s.icon} />}
      </button>
    ) : (
      iconRight
    );

  const hasLeft  = Boolean(iconLeft);
  const hasRight = Boolean(effectiveIconRight);

  const inputClasses = [
    "w-full rounded-xl border outline-none",
    "transition-all duration-200",
    "focus:ring-2 focus:ring-offset-0",
    s.input,
    hasLeft  ? "pl-10" : "pl-4",
    hasRight ? "pr-10" : "pr-4",
    themeBase[theme],
    error ? themeError[theme] : "",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label + sufijo */}
      {(label || labelSuffix) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={id}
              className={`text-sm font-medium ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {label}
            </label>
          )}
          {labelSuffix}
        </div>
      )}

      {/* Wrapper del campo */}
      <div className="relative flex items-center">
        {/* Icono izquierdo */}
        {iconLeft && (
          <span
            className={`absolute left-3 ${s.icon} ${
              theme === "dark" ? "text-slate-400" : "text-slate-400"
            } pointer-events-none`}
          >
            {iconLeft}
          </span>
        )}

        <input id={id} name={id} type={effectiveType} className={inputClasses} {...rest} />

        {/* Icono / elemento derecho */}
        {effectiveIconRight && (
          <span
            className={`absolute right-3 ${s.icon} ${
              theme === "dark" ? "text-slate-400" : "text-slate-400"
            }`}
          >
            {effectiveIconRight}
          </span>
        )}
      </div>

      {/* Error o hint */}
      {error ? (
        <p className="text-xs text-red-500 flex items-center gap-1" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

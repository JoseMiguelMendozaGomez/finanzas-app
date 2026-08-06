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
  ...rest
}: InputProps) {
  const s = sizeClasses[size];
  const hasLeft  = Boolean(iconLeft);
  const hasRight = Boolean(iconRight);

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

        <input id={id} name={id} className={inputClasses} {...rest} />

        {/* Icono / elemento derecho */}
        {iconRight && (
          <span
            className={`absolute right-3 ${s.icon} ${
              theme === "dark" ? "text-slate-400" : "text-slate-400"
            }`}
          >
            {iconRight}
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

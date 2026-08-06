import Link from "next/link";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: React.ReactNode;
  /** Convierte el botón en un <Link> de Next.js */
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa el 100% del ancho del contenedor */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Muestra un spinner y deshabilita la interacción */
  loading?: boolean;
  /** Icono a la izquierda del texto */
  iconLeft?: React.ReactNode;
  /** Icono a la derecha del texto */
  iconRight?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  /** Atributo aria-label para botones solo-icono */
  ariaLabel?: string;
}

// ─── Tokens de estilo ─────────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md disabled:bg-blue-300",
  secondary:
    "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 active:bg-blue-100 shadow-sm disabled:text-blue-300 disabled:border-blue-100",
  outline:
    "bg-transparent text-white border border-white/60 hover:bg-white/10 active:bg-white/20 disabled:opacity-40",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md disabled:bg-red-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2",
};

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold " +
  "transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:pointer-events-none " +
  "cursor-pointer select-none";

// ─── Spinner interno ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  className = "",
  type = "button",
  onClick,
  ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {content}
    </button>
  );
}

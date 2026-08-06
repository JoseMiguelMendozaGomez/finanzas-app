// ─── Tipos ────────────────────────────────────────────────────────────────────

export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeColor =
  | "blue"
  | "emerald"
  | "red"
  | "violet"
  | "amber"
  | "slate";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  /** Punto de estado pulsante a la izquierda */
  dot?: boolean;
  /** Activa la animación pulse en el dot */
  pulse?: boolean;
  className?: string;
}

// ─── Tokens de estilo ─────────────────────────────────────────────────────────

type ColorMap = Record<BadgeVariant, string>;

const colorClasses: Record<BadgeColor, ColorMap> = {
  blue: {
    solid:   "bg-blue-600   text-white",
    soft:    "bg-blue-50    text-blue-700  border border-blue-100",
    outline: "border border-blue-500 text-blue-600 bg-transparent",
  },
  emerald: {
    solid:   "bg-emerald-600 text-white",
    soft:    "bg-emerald-50  text-emerald-700 border border-emerald-100",
    outline: "border border-emerald-500 text-emerald-600 bg-transparent",
  },
  red: {
    solid:   "bg-red-600  text-white",
    soft:    "bg-red-50   text-red-700   border border-red-100",
    outline: "border border-red-500 text-red-600 bg-transparent",
  },
  violet: {
    solid:   "bg-violet-600 text-white",
    soft:    "bg-violet-50  text-violet-700 border border-violet-100",
    outline: "border border-violet-500 text-violet-600 bg-transparent",
  },
  amber: {
    solid:   "bg-amber-500 text-white",
    soft:    "bg-amber-50  text-amber-700  border border-amber-100",
    outline: "border border-amber-500 text-amber-600 bg-transparent",
  },
  slate: {
    solid:   "bg-slate-600 text-white",
    soft:    "bg-slate-100 text-slate-700  border border-slate-200",
    outline: "border border-slate-400 text-slate-600 bg-transparent",
  },
};

const dotColorClasses: Record<BadgeColor, string> = {
  blue:    "bg-blue-500",
  emerald: "bg-emerald-500",
  red:     "bg-red-500",
  violet:  "bg-violet-500",
  amber:   "bg-amber-500",
  slate:   "bg-slate-500",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2   py-0.5 text-xs",
  md: "px-2.5 py-1   text-xs",
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Badge({
  children,
  variant = "soft",
  color = "blue",
  size = "md",
  dot = false,
  pulse = false,
  className = "",
}: BadgeProps) {
  const classes = [
    "inline-flex items-center gap-1.5 rounded-full font-medium",
    colorClasses[color][variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {dot && (
        <span
          className={[
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColorClasses[color],
            pulse ? "animate-pulse" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

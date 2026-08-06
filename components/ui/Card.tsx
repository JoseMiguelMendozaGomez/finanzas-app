// ─── Tipos ────────────────────────────────────────────────────────────────────

export type CardVariant = "default" | "flat" | "dark" | "colored";
export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardColor   = "blue" | "emerald" | "red" | "violet" | "amber";

export interface CardProps {
  children: React.ReactNode;
  /**
   * default  → blanco, borde sutil, sombra leve, hover lift
   * flat     → blanco, borde sutil, sin sombra, sin hover
   * dark     → fondo semitransparente oscuro (auth / hero)
   * colored  → fondo de color semántico suave (requiere `color`)
   */
  variant?: CardVariant;
  color?: CardColor;
  padding?: CardPadding;
  /** Activa el efecto hover lift (solo en variant default) */
  hoverable?: boolean;
  className?: string;
  /** Convierte la card en un contenedor semántico <article> */
  as?: "div" | "article" | "section" | "li";
}

// ─── Tokens de estilo ─────────────────────────────────────────────────────────

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white border border-slate-100 shadow-sm",
  flat:    "bg-white border border-slate-100",
  dark:    "bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl",
  colored: "border shadow-sm",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

const colorClasses: Record<CardColor, string> = {
  blue:    "bg-blue-50   border-blue-100",
  emerald: "bg-emerald-50 border-emerald-100",
  red:     "bg-red-50    border-red-100",
  violet:  "bg-violet-50  border-violet-100",
  amber:   "bg-amber-50   border-amber-100",
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Card({
  children,
  variant = "default",
  color,
  padding = "lg",
  hoverable = false,
  className = "",
  as: Tag = "div",
}: CardProps) {
  const classes = [
    "rounded-2xl",
    variantClasses[variant],
    paddingClasses[padding],
    variant === "colored" && color ? colorClasses[color] : "",
    hoverable
      ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      : "transition-shadow duration-200",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}

import Button, { type ButtonProps } from "@/components/ui/Button";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface EmptyStateAction
  extends Pick<ButtonProps, "href" | "onClick" | "variant"> {
  label: string;
}

export interface EmptyStateProps {
  /** Icono SVG (React node) centrado sobre el título */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Hasta dos acciones: la primera primaria, la segunda secundaria */
  actions?: [EmptyStateAction?, EmptyStateAction?];
  /** Ocupa todo el espacio disponible del contenedor padre */
  fullHeight?: boolean;
  className?: string;
}

// ─── Icono por defecto ────────────────────────────────────────────────────────

function DefaultIcon() {
  return (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.25}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EmptyState({
  icon,
  title,
  description,
  actions,
  fullHeight = false,
  className = "",
}: EmptyStateProps) {
  const [primary, secondary] = actions ?? [];

  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center px-6 py-16",
        fullHeight ? "min-h-full flex-1" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Ícono */}
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-5">
        {icon ?? <DefaultIcon />}
      </div>

      {/* Texto */}
      <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* Acciones */}
      {(primary || secondary) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {primary && (
            <Button
              variant={primary.variant ?? "primary"}
              size="sm"
              href={primary.href}
              onClick={primary.onClick}
            >
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button
              variant={secondary.variant ?? "ghost"}
              size="sm"
              href={secondary.href}
              onClick={secondary.onClick}
            >
              {secondary.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

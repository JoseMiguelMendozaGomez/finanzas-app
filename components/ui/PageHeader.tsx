import Badge, { type BadgeProps } from "@/components/ui/Badge";
import Button, { type ButtonProps } from "@/components/ui/Button";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PageHeaderAction
  extends Pick<ButtonProps, "href" | "onClick" | "variant" | "iconLeft"> {
  label: string;
}

interface PageHeaderBadge
  extends Pick<BadgeProps, "color" | "variant" | "dot" | "pulse"> {
  label: string;
}

export interface PageHeaderProps {
  /** Texto pequeño encima del título (eyebrow) */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Badge de estado junto al título */
  badge?: PageHeaderBadge;
  /** Hasta dos acciones a la derecha del header */
  actions?: [PageHeaderAction?, PageHeaderAction?];
  /** Breadcrumb o ruta actual — array de strings, el último es la página actual */
  breadcrumb?: string[];
  className?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  breadcrumb,
  className = "",
}: PageHeaderProps) {
  const [primary, secondary] = actions ?? [];

  return (
    <div
      className={[
        "flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Columna izquierda */}
      <div className="min-w-0 flex-1">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-2" aria-label="Breadcrumb">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg
                    className="w-3.5 h-3.5 text-slate-300 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                <span
                  className={`text-xs font-medium ${
                    i === breadcrumb.length - 1
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <p className="text-blue-600 text-xs font-semibold tracking-widest uppercase mb-1">
            {eyebrow}
          </p>
        )}

        {/* Título + badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
          {badge && (
            <Badge
              color={badge.color}
              variant={badge.variant}
              dot={badge.dot}
              pulse={badge.pulse}
            >
              {badge.label}
            </Badge>
          )}
        </div>

        {/* Descripción */}
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Acciones (columna derecha en desktop) */}
      {(primary || secondary) && (
        <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-6 shrink-0">
          {secondary && (
            <Button
              variant={secondary.variant ?? "ghost"}
              size="sm"
              href={secondary.href}
              onClick={secondary.onClick}
              iconLeft={secondary.iconLeft}
            >
              {secondary.label}
            </Button>
          )}
          {primary && (
            <Button
              variant={primary.variant ?? "primary"}
              size="sm"
              href={primary.href}
              onClick={primary.onClick}
              iconLeft={primary.iconLeft}
            >
              {primary.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

import type { NavIconName } from "@/components/dashboard/nav-items";
import NavIcon from "@/components/dashboard/NavIcon";
import { PageHeader } from "@/components/ui";
import { Badge } from "@/components/ui";

interface UnderConstructionProps {
  title: string;
  description: string;
  icon: NavIconName;
  /** Color semántico del ícono decorativo */
  color?: "blue" | "emerald" | "red" | "violet" | "amber";
}

const colorMap = {
  blue:    { wrap: "bg-blue-50 text-blue-500",     ring: "ring-blue-100"    },
  emerald: { wrap: "bg-emerald-50 text-emerald-500", ring: "ring-emerald-100" },
  red:     { wrap: "bg-red-50 text-red-500",        ring: "ring-red-100"     },
  violet:  { wrap: "bg-violet-50 text-violet-500",  ring: "ring-violet-100"  },
  amber:   { wrap: "bg-amber-50 text-amber-500",    ring: "ring-amber-100"   },
};

const features: Record<NavIconName, string[]> = {
  dashboard:    ["Resumen financiero", "Balance general", "Actividad reciente", "Gráficos de tendencia"],
  transactions: ["Registro de ingresos", "Registro de gastos", "Filtros y búsqueda", "Exportar a CSV"],
  categories:   ["Categorías personalizadas", "Colores e íconos", "Subcategorías", "Estadísticas por categoría"],
  goals:        ["Crear metas de ahorro", "Progreso visual", "Fecha objetivo", "Aportaciones parciales"],
  reminders:    ["Recordatorios de pago", "Frecuencia configurable", "Notificaciones", "Historial de pagos"],
  profile:      ["Datos personales", "Cambiar contraseña", "Preferencias", "Cerrar sesión"],
};

export default function UnderConstruction({
  title,
  description,
  icon,
  color = "blue",
}: UnderConstructionProps) {
  const c = colorMap[color];
  const featureList = features[icon];

  return (
    <div className="space-y-8">
      {/* Header de página */}
      <PageHeader
        title={title}
        description={description}
        badge={{ label: "En construcción", color: "amber", variant: "soft", dot: true, pulse: true }}
      />

      {/* Card principal */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Banda de color superior */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />

        <div className="p-8 sm:p-12 flex flex-col items-center text-center">
          {/* Ícono */}
          <div
            className={`w-20 h-20 rounded-2xl ${c.wrap} ring-8 ${c.ring} flex items-center justify-center mb-6`}
          >
            <NavIcon name={icon} className="w-9 h-9" />
          </div>

          <Badge color="amber" variant="soft" dot pulse className="mb-4">
            Módulo en desarrollo
          </Badge>

          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {title} está en construcción
          </h2>
          <p className="text-slate-500 text-base max-w-md leading-relaxed mb-10">
            Estamos construyendo esta funcionalidad. Pronto podrás gestionar{" "}
            {description.toLowerCase()}.
          </p>

          {/* Funcionalidades próximas */}
          <div className="w-full max-w-sm text-left">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Funcionalidades previstas
            </p>
            <ul className="space-y-3">
              {featureList.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-sm text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

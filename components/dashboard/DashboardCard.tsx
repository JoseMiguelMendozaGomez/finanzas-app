type CardColor = "emerald" | "red" | "blue" | "violet";

interface DashboardCardProps {
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  color: CardColor;
  /** Si se pasa, la card se vuelve clickeable y oculta el badge "Próximamente" */
  onClick?: () => void;
}

const colorMap: Record<CardColor, { icon: string; badge: string; value: string }> = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    value: "text-emerald-600",
  },
  red: {
    icon: "bg-red-50 text-red-600",
    badge: "bg-red-50 text-red-700 border-red-100",
    value: "text-red-600",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    value: "text-blue-600",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    value: "text-violet-600",
  },
};

export default function DashboardCard({
  title,
  description,
  value,
  icon,
  color,
  onClick,
}: DashboardCardProps) {
  const c = colorMap[color];
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left w-full ${
        onClick
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          : ""
      }`}
    >
      {/* Cabecera: ícono + badge "Próximamente" */}
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}
        >
          {icon}
        </div>
        {!onClick && (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${c.badge}`}
          >
            Próximamente
          </span>
        )}
      </div>

      {/* Valor */}
      <div>
        <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
        <p className="text-slate-800 font-semibold mt-1">{title}</p>
      </div>

      {/* Descripción */}
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </Tag>
  );
}

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "100%", label: "Gratuito" },
  { value: "5 min", label: "Para configurar" },
  { value: "6", label: "Módulos integrados" },
  { value: "1", label: "Plataforma unificada" },
];

export default function Stats() {
  return (
    <section className="py-16 px-6 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-blue-600">
                {stat.value}
              </span>
              <span className="text-slate-500 text-sm font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

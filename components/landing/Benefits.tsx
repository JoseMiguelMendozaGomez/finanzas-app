import Card from "@/components/ui/Card";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const benefits: Benefit[] = [
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Control total",
    description:
      "Registra ingresos y gastos fácilmente. Visualiza tu situación financiera en tiempo real con reportes claros y detallados.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    title: "Metas de ahorro",
    description:
      "Da seguimiento a tus objetivos financieros. Define metas, rastrea tu progreso y celebra cada logro en el camino.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    title: "Recordatorios inteligentes",
    description:
      "No olvides pagos importantes. Programa alertas y mantente al día con todas tus obligaciones financieras.",
    color: "bg-violet-50 text-violet-600",
  },
];

export default function Benefits() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header de sección */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm tracking-widest uppercase">
            Beneficios
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
            Herramientas simples y poderosas para tomar el control de tu
            economía personal.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              {/* Ícono */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${benefit.color}`}
              >
                {benefit.icon}
              </div>

              {/* Texto */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

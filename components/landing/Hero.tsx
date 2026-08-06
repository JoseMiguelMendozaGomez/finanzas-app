import Button from "@/components/ui/Button";
import Navbar from "@/components/landing/Navbar";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Navbar />
      {/* Fondo con gradiente financiero */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

      {/* Patrón de puntos decorativo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.4) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Círculos decorativos de fondo */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-300 text-sm font-medium tracking-wide">
            Gestión financiera personal
          </span>
        </div>

        {/* Título */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
          Controla tus{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            finanzas personales
          </span>{" "}
          de forma inteligente
        </h1>

        {/* Subtítulo */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Gestiona ingresos, gastos, metas de ahorro y recordatorios desde una
          sola plataforma.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/registro" variant="primary" size="lg">
            Crear cuenta gratis
          </Button>
          <Button href="/login" variant="outline" size="lg">
            Iniciar sesión
          </Button>
        </div>

        {/* Indicadores de confianza */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Sin tarjeta de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Configuración en minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>100% gratuito</span>
          </div>
        </div>
      </div>

      {/* Flecha scroll down */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 animate-bounce">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}

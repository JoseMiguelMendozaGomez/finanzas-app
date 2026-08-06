import Button from "@/components/ui/Button";

export default function CtaFinal() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-800/40 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Ícono */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-8 border border-white/20">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          Empieza hoy a tomar control de tus finanzas.
        </h2>

        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Únete y comienza a gestionar tu dinero de manera inteligente. Es
          gratis, rápido y sin complicaciones.
        </p>

        <Button href="/registro" variant="secondary" size="lg">
          Crear cuenta gratis →
        </Button>

        <p className="mt-6 text-blue-200 text-sm">
          Sin tarjeta de crédito · Sin compromisos · 100% gratuito
        </p>
      </div>
    </section>
  );
}

import AppLogo from "@/components/ui/AppLogo";
import BackLink from "@/components/ui/BackLink";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Título principal (h1) */
  title: string;
  /** Subtítulo descriptivo */
  subtitle: string;
}

/**
 * Wrapper compartido para todas las páginas de autenticación.
 * Mantiene el mismo gradiente y decoración del Hero de la landing.
 */
export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Círculos decorativos — misma estética que el Hero */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Patrón de puntos sutil */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.4) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Cabecera: logo + título */}
        <div className="text-center mb-8">
          <AppLogo href="/" size="md" />
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-slate-400 text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Contenido del formulario */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {children}
        </div>

        {/* Enlace volver al inicio */}
        <div className="mt-6 text-center">
          <BackLink href="/" label="Volver al inicio" />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 py-5">
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group min-w-0"
          aria-label="Finanzas App — inicio"
        >
          <div className="w-8 h-8 shrink-0 bg-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:bg-blue-400 transition-colors duration-200">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <span className="hidden sm:inline text-slate-900 font-bold text-lg tracking-tight truncate">
            Finanzas App
          </span>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button href="/login" variant="outline" size="sm">
            Iniciar sesión
          </Button>
          <Button href="/registro" variant="primary" size="sm">
            Crear cuenta
          </Button>
        </div>
      </nav>
    </header>
  );
}

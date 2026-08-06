interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export default function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-20">
      {/* Botón hamburguesa — solo mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
        aria-label="Abrir menú de navegación"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Separador visual mobile */}
      <div className="lg:hidden w-px h-5 bg-slate-200 shrink-0" />

      {/* Breadcrumb / espacio flexible */}
      <div className="flex-1 min-w-0" />

      {/* Acciones del header */}
      <div className="flex items-center gap-2">
        {/* Notificaciones (placeholder) */}
        <button
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative"
          aria-label="Notificaciones"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Dot de notificación */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200" />

        {/* Avatar de usuario */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <span className="text-slate-700 text-sm font-medium hidden sm:block">
            Usuario
          </span>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLogo from "@/components/ui/AppLogo";
import UserAvatarImage from "@/components/ui/UserAvatarImage";
import NavIcon from "@/components/dashboard/NavIcon";
import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import type { DashboardUser } from "@/components/dashboard/types";
import { logoutAction } from "@/features/auth/actions";

interface SidebarProps {
  /** Controlado desde el layout — si el overlay mobile está abierto */
  mobileOpen: boolean;
  onClose: () => void;
  user?: DashboardUser;
}

export default function Sidebar({ mobileOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const navContent = (
    <nav className="flex flex-col h-full" aria-label="Navegación principal">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <AppLogo href="/dashboard" size="sm" />
      </div>

      {/* Ítems de navegación */}
      <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-150",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={[
                    "shrink-0",
                    active ? "text-blue-600" : "text-slate-400",
                  ].join(" ")}
                >
                  <NavIcon name={item.icon} />
                </span>
                {item.label}

                {/* Indicador activo */}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer del sidebar */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <UserAvatarImage
            userId={user?.id}
            name={user?.name}
            email={user?.email}
            avatarUpdatedAt={user?.avatarUpdatedAt}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.name || "Usuario"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email || "—"}
            </p>
          </div>
          <form action={logoutAction} className="shrink-0">
            <button
              type="submit"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-colors"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* ── Desktop: sidebar fijo ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-100 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* ── Mobile: overlay + drawer ── */}
      {mobileOpen && (
        <>
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:hidden flex flex-col animate-in slide-in-from-left duration-200">
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Cerrar menú"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}

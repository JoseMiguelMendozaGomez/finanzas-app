/**
 * Definición centralizada de los ítems de navegación del dashboard.
 * Usada por Sidebar y cualquier otro componente de navegación.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Nombre del ícono — referenciado en el componente NavIcon */
  icon: NavIconName;
}

export type NavIconName =
  | "dashboard"
  | "transactions"
  | "categories"
  | "goals"
  | "reminders"
  | "reports"
  | "profile";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",       href: "/dashboard",      icon: "dashboard"     },
  { label: "Resumen",         href: "/resumen",        icon: "transactions"  },
  { label: "Categorías",      href: "/categorias",     icon: "categories"    },
  { label: "Metas de ahorro", href: "/metas",          icon: "goals"         },
  { label: "Recordatorios",   href: "/recordatorios",  icon: "reminders"     },
  { label: "Reportes",        href: "/reportes",       icon: "reports"       },
  { label: "Perfil",          href: "/perfil",         icon: "profile"       },
];

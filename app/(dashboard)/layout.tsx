import DashboardShell from "@/components/dashboard/DashboardShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout compartido para todas las rutas del dashboard.
 * Server Component — el estado del sidebar mobile vive en DashboardShell (client).
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}

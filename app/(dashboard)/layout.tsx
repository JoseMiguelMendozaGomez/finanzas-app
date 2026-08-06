import DashboardShell from "@/components/dashboard/DashboardShell";
import { auth } from "@/lib/auth/config";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout compartido para todas las rutas del dashboard.
 * Server Component — el estado del sidebar mobile vive en DashboardShell (client).
 */
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  return <DashboardShell user={session?.user}>{children}</DashboardShell>;
}

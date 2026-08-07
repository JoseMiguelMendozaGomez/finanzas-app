import DashboardShell from "@/components/dashboard/DashboardShell";
import { auth } from "@/lib/auth/config";
import { getProfile } from "@/features/profile/queries";

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

  // El nombre del JWT solo se fija al iniciar sesión — se lee de la base de
  // datos en cada visita para reflejar cambios de perfil sin re-login.
  const profile = session?.user?.id
    ? await getProfile(session.user.id)
    : null;

  const user = profile
    ? { name: profile.name, email: profile.email }
    : session?.user;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}

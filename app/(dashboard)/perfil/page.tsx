import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { getProfile } from "@/features/profile/queries";
import ProfileView from "@/components/dashboard/perfil/ProfileView";

export const metadata: Metadata = {
  title: "Perfil — Finanzas App",
  description: "Administra tu cuenta y preferencias.",
};

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfile(session.user.id);
  if (!profile) redirect("/login");

  return (
    <ProfileView
      name={profile.name}
      email={profile.email}
      memberSince={profile.createdAt}
    />
  );
}

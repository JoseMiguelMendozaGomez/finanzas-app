import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { getAllCategoriesWithCounts } from "@/features/transactions/queries";
import CategoriesView from "@/components/dashboard/categorias/CategoriesView";

export const metadata: Metadata = {
  title: "Categorías — Inverza",
  description: "Organiza tus transacciones por categorías personalizadas.",
};

export default async function CategoriasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const categories = await getAllCategoriesWithCounts(session.user.id);

  return <CategoriesView categories={categories} />;
}

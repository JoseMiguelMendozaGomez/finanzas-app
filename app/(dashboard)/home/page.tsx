import { redirect } from "next/navigation";

/**
 * /home redirige permanentemente a /dashboard.
 * El contenido real del panel vive en /dashboard/page.tsx.
 */
export default function HomePage() {
  redirect("/dashboard");
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Inverza — Finanzas personales",
    short_name: "Inverza",
    description:
      "Controlá tus ingresos, gastos, metas de ahorro y recordatorios desde el celular.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#faf7f6",
    theme_color: "#78406f",
    lang: "es",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

"use client";

import { useEffect } from "react";

/**
 * Registra el service worker (public/sw.js) una vez montada la app.
 * No renderiza nada — solo efecto de registro.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Si falla el registro (ej. navegador sin soporte, modo privado
      // restrictivo), la app sigue funcionando normal — solo sin caché offline.
    });
  }, []);

  return null;
}

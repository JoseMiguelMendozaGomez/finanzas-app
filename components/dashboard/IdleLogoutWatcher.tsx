"use client";

import { useEffect, useRef } from "react";
import { logoutAction } from "@/features/auth/actions";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos sin actividad
const ACTIVITY_EVENTS = [
  "mousemove",
  "keydown",
  "click",
  "scroll",
  "touchstart",
] as const;

/**
 * Cierra la sesión automáticamente tras 30 minutos sin interacción.
 * Se monta una sola vez en DashboardShell — cubre todo el área autenticada.
 */
export default function IdleLogoutWatcher() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        logoutAction();
      }, IDLE_TIMEOUT_MS);
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return null;
}

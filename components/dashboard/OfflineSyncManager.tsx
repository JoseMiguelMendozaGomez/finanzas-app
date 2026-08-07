"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getQueuedTransactions,
  removeQueuedTransaction,
} from "@/lib/offline/db";
import { QUEUE_CHANGED_EVENT } from "@/lib/offline/events";
import { createTransactionAction } from "@/features/transactions/actions";

/**
 * Vive montado en todo el dashboard. Muestra un aviso cuando no hay
 * conexión y, apenas vuelve, sube las transacciones que se encolaron
 * offline (ver TransactionView.tsx) llamando a la misma Server Action que
 * se usa online.
 */
export default function OfflineSyncManager() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOnline(navigator.onLine);

    async function refreshCount() {
      const items = await getQueuedTransactions();
      setPendingCount(items.length);
    }

    async function syncQueue() {
      if (syncingRef.current) return;
      syncingRef.current = true;
      setSyncing(true);
      try {
        const items = await getQueuedTransactions();
        let syncedAny = false;
        for (const item of items) {
          const fd = new FormData();
          fd.set("amount", item.amount);
          fd.set("date", item.date);
          fd.set("description", item.description);
          fd.set("categoryId", item.categoryId);
          fd.set("isRecurring", item.isRecurring ? "on" : "off");
          if (item.recurrenceFrequency) {
            fd.set("recurrenceFrequency", item.recurrenceFrequency);
          }
          try {
            const result = await createTransactionAction(item.type, {}, fd);
            if (!result.errors && !result.message) {
              await removeQueuedTransaction(item.localId);
              syncedAny = true;
            } else {
              // El servidor rechazó este pendiente (ej. la categoría se
              // borró mientras tanto) — se descarta para no bloquear el
              // resto de la cola.
              await removeQueuedTransaction(item.localId);
            }
          } catch {
            // Sigue sin conexión de verdad — se reintenta en el próximo "online".
            break;
          }
        }
        if (syncedAny) router.refresh();
      } finally {
        syncingRef.current = false;
        setSyncing(false);
        refreshCount();
      }
    }

    function handleOnline() {
      setIsOnline(true);
      syncQueue();
    }
    function handleOffline() {
      setIsOnline(false);
    }

    refreshCount();
    window.addEventListener(QUEUE_CHANGED_EVENT, refreshCount);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) syncQueue();

    return () => {
      window.removeEventListener(QUEUE_CHANGED_EVENT, refreshCount);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [router]);

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 ${
        !isOnline ? "bg-slate-800 text-white" : "bg-blue-600 text-white"
      }`}
      role="status"
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          !isOnline ? "bg-amber-400" : "bg-white animate-pulse"
        }`}
      />
      {!isOnline
        ? pendingCount > 0
          ? `Sin conexión — ${pendingCount} pendiente${pendingCount === 1 ? "" : "s"} de sincronizar`
          : "Sin conexión"
        : syncing
          ? `Sincronizando ${pendingCount}...`
          : `${pendingCount} pendiente${pendingCount === 1 ? "" : "s"} de sincronizar`}
    </div>
  );
}

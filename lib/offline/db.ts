import { openDB, type IDBPDatabase } from "idb";
import { notifyQueueChanged } from "./events";

const DB_NAME = "inverza-offline";
const DB_VERSION = 1;
const STORE = "pending-transactions";

export interface QueuedTransaction {
  localId: string;
  type: "INCOME" | "EXPENSE";
  amount: string;
  date: string;
  description: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  isRecurring: boolean;
  recurrenceFrequency?: string;
  createdAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "localId" });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Guarda una transacción creada sin conexión — solo se admiten categorías
 * ya existentes (crear una categoría nueva necesita ida y vuelta al
 * servidor, así que esa opción se deshabilita en el formulario si no hay
 * señal).
 */
export async function queueTransaction(
  item: Omit<QueuedTransaction, "localId" | "createdAt">
): Promise<QueuedTransaction> {
  const db = await getDb();
  const record: QueuedTransaction = {
    ...item,
    localId: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  await db.add(STORE, record);
  notifyQueueChanged();
  return record;
}

export async function getQueuedTransactions(): Promise<QueuedTransaction[]> {
  const db = await getDb();
  const all = await db.getAll(STORE);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function removeQueuedTransaction(localId: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, localId);
  notifyQueueChanged();
}

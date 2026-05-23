import type { ExpenseId, Receipt, UserProfile } from "@/types";
import { type IDBPDatabase, openDB as idbOpen } from "idb";

const DB_NAME = "fieldspend";
const DB_VERSION = 2; // bumped for drafts store

type AppDB = {
  receipts: {
    key: string;
    value: Receipt;
    indexes: { "by-date": string };
  };
  profile: {
    key: string;
    value: UserProfile;
  };
  drafts: {
    key: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: { id: string; data: any; savedAt: string };
  };
};

let _db: IDBPDatabase<AppDB> | null = null;

export async function openDB(): Promise<IDBPDatabase<AppDB>> {
  if (_db) return _db;
  _db = await idbOpen<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("receipts")) {
        const receiptStore = db.createObjectStore("receipts", {
          keyPath: "id",
        });
        receiptStore.createIndex("by-date", "date");
      }
      if (!db.objectStoreNames.contains("profile")) {
        db.createObjectStore("profile", { keyPath: "userId" });
      }
      if (!db.objectStoreNames.contains("drafts")) {
        db.createObjectStore("drafts", { keyPath: "id" });
      }
    },
  });
  return _db;
}

// ─── Draft helpers (IndexedDB-backed — survives Back navigation & tab close) ───

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveDraftIDB(draftId: string, data: any): Promise<void> {
  try {
    const db = await openDB();
    await db.put("drafts", {
      id: draftId,
      data,
      savedAt: new Date().toISOString(),
    });
  } catch {
    /* silent — IndexedDB unavailable */
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadDraftIDB(draftId: string): Promise<any> {
  try {
    const db = await openDB();
    const record = await db.get("drafts", draftId);
    return record?.data ?? null;
  } catch {
    return null;
  }
}

export async function clearDraftIDB(draftId: string): Promise<void> {
  try {
    const db = await openDB();
    await db.delete("drafts", draftId);
  } catch {
    /* silent */
  }
}

// ─── Receipt helpers ────────────────────────────────────────────────────

export async function getReceipts(): Promise<Receipt[]> {
  const db = await openDB();
  return db.getAll("receipts");
}

export async function addReceipt(receipt: Receipt): Promise<void> {
  const db = await openDB();
  await db.put("receipts", receipt);
}

export async function updateReceipt(receipt: Receipt): Promise<void> {
  const db = await openDB();
  await db.put("receipts", receipt);
}

export async function deleteReceipt(id: ExpenseId): Promise<void> {
  const db = await openDB();
  await db.delete("receipts", id);
}

export async function getReceiptsByMonth(
  year: number,
  month: number,
): Promise<Receipt[]> {
  const all = await getReceipts();
  return all.filter((r) => {
    const d = new Date(r.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

export async function getDailyCount(dateStr: string): Promise<number> {
  const db = await openDB();
  const index = db.transaction("receipts").store.index("by-date");
  const keys = await index.getAllKeys(dateStr);
  return keys.length;
}

export async function getProfile(): Promise<UserProfile | undefined> {
  const db = await openDB();
  const all = await db.getAll("profile");
  return all[0];
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const db = await openDB();
  await db.put("profile", profile);
}

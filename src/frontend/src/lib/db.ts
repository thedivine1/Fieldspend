import type { ExpenseId, Receipt, UserProfile } from "@/types";
import { type IDBPDatabase, openDB as idbOpen } from "idb";

const DB_NAME = "salesexpense-pro";
const DB_VERSION = 1;

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
    },
  });
  return _db;
}

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

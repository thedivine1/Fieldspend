// ─── Enums ────────────────────────────────────────────────────────────────────

export type Category =
  | "cab"
  | "train"
  | "bus"
  | "localBus"
  | "auto"
  | "flight"
  | "hotel"
  | "meal"
  | "other";

export type Language = "en" | "hi" | "mr";

// ─── Constants ────────────────────────────────────────────────────────────────

// Admin email — grants admin badge and identification
export const ADMIN_EMAIL = "coepianraider@gmail.com";

// ─── Core Types ───────────────────────────────────────────────────────────────

export type ExpenseId = string;
export type UserId = string;
export type Timestamp = number; // Unix ms

export interface Receipt {
  id: ExpenseId;
  imageData: string; // base64 data URL
  date: string; // YYYY-MM-DD
  category: Category;
  amount?: number;
  notes?: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  userId: UserId;
  name: string;
  email?: string;
  companyName?: string;
  preferredLanguage: Language;
  dailyUploadCount: number;
  lastUploadDate: string; // YYYY-MM-DD
}

export interface CategoryTotal {
  category: Category;
  total: number;
  count: number;
}

export interface ExpenseReport {
  title: string;
  month: number;
  year: number;
  userId: UserId;
  receipts: Receipt[];
  totalAmount: number;
  categoryBreakdown: CategoryTotal[];
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export interface DayGroup {
  dateStr: string; // YYYY-MM-DD
  label: string;
  receipts: Receipt[];
  total: number;
}

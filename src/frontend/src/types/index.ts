// ─── Enums ────────────────────────────────────────────────────────────────────

export type Category =
  | "cab"
  | "train"
  | "bus"
  | "flight"
  | "hotel"
  | "meal"
  | "other";

export type Language = "en" | "hi" | "mr";

// ─── Constants ────────────────────────────────────────────────────────────────

export const FREE_DAILY_LIMIT = 10;
export const BETA_DAYS = 60;
export const PREMIUM_MONTHLY_RS = 99;
export const PREMIUM_ANNUAL_RS = 49;

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
  companyName?: string;
  preferredLanguage: Language;
  isPremium: boolean;
  betaExpiryDate: Timestamp;
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

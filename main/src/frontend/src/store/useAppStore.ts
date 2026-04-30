import {
  addReceipt as dbAddReceipt,
  deleteReceipt as dbDeleteReceipt,
  saveProfile as dbSaveProfile,
  updateReceipt as dbUpdateReceipt,
  getProfile,
  getReceipts,
} from "@/lib/db";
import { getCurrentLanguage, setLanguage as i18nSetLanguage } from "@/lib/i18n";
import type { Language, Receipt, UserProfile } from "@/types";
import { create } from "zustand";

const DARK_MODE_KEY = "sep_dark_mode";

interface AppState {
  receipts: Receipt[];
  userProfile: UserProfile | null;
  currentLanguage: Language;
  isDarkMode: boolean;
  isOnboardingComplete: boolean;
  selectedMonth: number;
  selectedYear: number;

  // Actions
  loadReceipts: () => Promise<void>;
  addReceipt: (receipt: Receipt) => Promise<void>;
  updateReceipt: (receipt: Receipt) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  loadProfile: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  setOnboardingComplete: (complete: boolean) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  initStore: () => void;
}

function applyDarkMode(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

const now = new Date();
const storedDark = localStorage.getItem(DARK_MODE_KEY);
const initialDark = storedDark !== null ? storedDark === "true" : false;
const initialOnboarding =
  localStorage.getItem("sep_onboarding_complete") === "true";

// Apply on load
applyDarkMode(initialDark);

export const useAppStore = create<AppState>((set, get) => ({
  receipts: [],
  userProfile: null,
  currentLanguage: getCurrentLanguage(),
  isDarkMode: initialDark,
  isOnboardingComplete: initialOnboarding,
  selectedMonth: now.getMonth() + 1,
  selectedYear: now.getFullYear(),

  initStore: () => {
    const { isDarkMode } = get();
    applyDarkMode(isDarkMode);
  },

  loadReceipts: async () => {
    const receipts = await getReceipts();
    set({ receipts });
  },

  addReceipt: async (receipt: Receipt) => {
    await dbAddReceipt(receipt);
    set((state) => ({ receipts: [receipt, ...state.receipts] }));
  },

  updateReceipt: async (receipt: Receipt) => {
    await dbUpdateReceipt(receipt);
    set((state) => ({
      receipts: state.receipts.map((r) => (r.id === receipt.id ? receipt : r)),
    }));
  },

  deleteReceipt: async (id: string) => {
    await dbDeleteReceipt(id);
    set((state) => ({ receipts: state.receipts.filter((r) => r.id !== id) }));
  },

  loadProfile: async () => {
    const userProfile = await getProfile();
    if (userProfile) {
      set({ userProfile });
    }
  },

  saveProfile: async (profile: UserProfile) => {
    await dbSaveProfile(profile);
    set({ userProfile: profile });
  },

  setLanguage: (lang: Language) => {
    i18nSetLanguage(lang);
    set({ currentLanguage: lang });
  },

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    localStorage.setItem(DARK_MODE_KEY, String(next));
    applyDarkMode(next);
    set({ isDarkMode: next });
  },

  setOnboardingComplete: (complete: boolean) => {
    localStorage.setItem("sep_onboarding_complete", String(complete));
    set({ isOnboardingComplete: complete });
  },

  setSelectedMonth: (month: number) => set({ selectedMonth: month }),
  setSelectedYear: (year: number) => set({ selectedYear: year }),
}));

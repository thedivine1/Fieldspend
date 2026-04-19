import type { UserProfile } from "@/types";
import {
  BETA_DAYS,
  FREE_DAILY_LIMIT,
  PREMIUM_ANNUAL_RS,
  PREMIUM_MONTHLY_RS,
} from "@/types";

// ─── Beta Logic ───────────────────────────────────────────────────────────────

export function isBetaPeriodActive(profile: UserProfile): boolean {
  return Date.now() < profile.betaExpiryDate;
}

export function getBetaDaysLeft(profile: UserProfile): number {
  const msLeft = profile.betaExpiryDate - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

// ─── Access Control ───────────────────────────────────────────────────────────

export function hasPremiumAccess(profile: UserProfile): boolean {
  return profile.isPremium || isBetaPeriodActive(profile);
}

export function isFreeTierLimitReached(dailyCount: number): boolean {
  return dailyCount >= FREE_DAILY_LIMIT;
}

export interface UploadPermission {
  allowed: boolean;
  reason?: string;
}

export function canUploadReceipt(
  profile: UserProfile,
  dailyCount: number,
): UploadPermission {
  if (hasPremiumAccess(profile)) {
    return { allowed: true };
  }

  if (isFreeTierLimitReached(dailyCount)) {
    return {
      allowed: false,
      reason: "status.limit_reached",
    };
  }

  return { allowed: true };
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export function getPremiumPrice(): { monthly: number; annual: number } {
  return {
    monthly: PREMIUM_MONTHLY_RS,
    annual: PREMIUM_ANNUAL_RS,
  };
}

// ─── New Profile Factory ──────────────────────────────────────────────────────

export function createDefaultProfile(
  userId: string,
  name: string,
  companyName?: string,
): UserProfile {
  return {
    userId,
    name,
    companyName,
    preferredLanguage: "en",
    isPremium: false,
    betaExpiryDate: Date.now() + BETA_DAYS * 24 * 60 * 60 * 1000,
    dailyUploadCount: 0,
    lastUploadDate: new Date().toISOString().split("T")[0],
  };
}

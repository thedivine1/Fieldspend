import type { UserProfile } from "@/types";
import {
  ADMIN_EMAIL,
  BETA_END_DATE,
  FREE_DAILY_LIMIT,
  PREMIUM_ANNUAL_RS,
  PREMIUM_MONTHLY_RS,
} from "@/types";

// ─── Admin Check ──────────────────────────────────────────────────────────────

export function isAdminUser(profile: UserProfile): boolean {
  return (
    (profile.email ?? "").toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()
  );
}

// ─── Beta Logic ───────────────────────────────────────────────────────────────

/** Beta ends on the global fixed date July 31 2026 (IST), not per-user install date */
export function isBetaPeriodActive(_profile?: UserProfile): boolean {
  return Date.now() < BETA_END_DATE;
}

export function getBetaDaysLeft(_profile?: UserProfile): number {
  const msLeft = BETA_END_DATE - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

// ─── Access Control ───────────────────────────────────────────────────────────

export function hasPremiumAccess(profile: UserProfile): boolean {
  if (isAdminUser(profile)) return true;
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
  if (isAdminUser(profile)) return { allowed: true };
  if (hasPremiumAccess(profile)) return { allowed: true };

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
  email?: string,
): UserProfile {
  return {
    userId,
    name,
    email,
    companyName,
    preferredLanguage: "en",
    isPremium: false,
    betaExpiryDate: BETA_END_DATE,
    dailyUploadCount: 0,
    lastUploadDate: new Date().toISOString().split("T")[0],
  };
}

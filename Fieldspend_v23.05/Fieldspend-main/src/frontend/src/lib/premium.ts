import { ADMIN_EMAIL } from "@/types";
import type { UserProfile } from "@/types";

// ─── Admin Check ──────────────────────────────────────────────────────────────

export function isAdminUser(profile: UserProfile): boolean {
  return (
    (profile.email ?? "").toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()
  );
}

// ─── Access ───────────────────────────────────────────────────────────────────

/** All users have unrestricted access during the open testing phase. */
export function canUpload(_profile: UserProfile): boolean {
  return true;
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
    dailyUploadCount: 0,
    lastUploadDate: new Date().toISOString().split("T")[0],
  };
}

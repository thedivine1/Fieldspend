import { c as createLucideIcon } from "./index-Q7Jk8N_s.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const FREE_DAILY_LIMIT = 10;
const BETA_END_DATE = (/* @__PURE__ */ new Date("2026-08-01T00:00:00+05:30")).getTime();
const ADMIN_EMAIL = "coepianraider@gmail.com";
function isAdminUser(profile) {
  return (profile.email ?? "").toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}
function isBetaPeriodActive(_profile) {
  return Date.now() < BETA_END_DATE;
}
function getBetaDaysLeft(_profile) {
  const msLeft = BETA_END_DATE - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1e3 * 60 * 60 * 24)));
}
function hasPremiumAccess(profile) {
  if (isAdminUser(profile)) return true;
  return profile.isPremium || isBetaPeriodActive();
}
function getAllowedUploadCount(profile) {
  const adBatches = profile.adUnlockedUploads ?? 0;
  return FREE_DAILY_LIMIT + adBatches * 5;
}
function needsAdForUpload(profile, totalUploaded) {
  if (isAdminUser(profile)) return false;
  if (hasPremiumAccess(profile)) return false;
  if (isBetaPeriodActive()) return false;
  return totalUploaded >= getAllowedUploadCount(profile);
}
function getPremiumExpiryLabel(profile) {
  if (!profile.premiumExpiryDate) return "";
  return new Date(profile.premiumExpiryDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function applyPremiumToProfile(profile, plan, expiryDate) {
  return {
    ...profile,
    isPremium: true,
    premiumPlan: plan,
    premiumExpiryDate: expiryDate
  };
}
function createDefaultProfile(userId, name, companyName, email) {
  return {
    userId,
    name,
    email,
    companyName,
    preferredLanguage: "en",
    isPremium: false,
    betaExpiryDate: BETA_END_DATE,
    dailyUploadCount: 0,
    lastUploadDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    adWatchCount: 0,
    adUnlockedUploads: 0
  };
}
export {
  CircleCheck as C,
  FREE_DAILY_LIMIT as F,
  Sparkles as S,
  Zap as Z,
  isBetaPeriodActive as a,
  getBetaDaysLeft as b,
  getPremiumExpiryLabel as c,
  createDefaultProfile as d,
  applyPremiumToProfile as e,
  getAllowedUploadCount as g,
  hasPremiumAccess as h,
  isAdminUser as i,
  needsAdForUpload as n
};

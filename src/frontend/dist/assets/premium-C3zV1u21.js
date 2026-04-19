import { c as createLucideIcon } from "./index-Qp0UCZEp.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
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
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const FREE_DAILY_LIMIT = 10;
const BETA_DAYS = 60;
function isBetaPeriodActive(profile) {
  return Date.now() < profile.betaExpiryDate;
}
function getBetaDaysLeft(profile) {
  const msLeft = profile.betaExpiryDate - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1e3 * 60 * 60 * 24)));
}
function hasPremiumAccess(profile) {
  return profile.isPremium || isBetaPeriodActive(profile);
}
function createDefaultProfile(userId, name, companyName) {
  return {
    userId,
    name,
    companyName,
    preferredLanguage: "en",
    isPremium: false,
    betaExpiryDate: Date.now() + BETA_DAYS * 24 * 60 * 60 * 1e3,
    dailyUploadCount: 0,
    lastUploadDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
}
export {
  CircleCheck as C,
  FREE_DAILY_LIMIT as F,
  Sparkles as S,
  createDefaultProfile as c,
  getBetaDaysLeft as g,
  hasPremiumAccess as h,
  isBetaPeriodActive as i
};

import { c as createLucideIcon, a as useAppStore, u as useNavigate, r as reactExports, t as tLang, j as jsxRuntimeExports } from "./index-Q7Jk8N_s.js";
import { B as Button } from "./index-C6_FkSE_.js";
import { A as AnimatePresence } from "./index-CmqUWI1H.js";
import { m as motion } from "./proxy-oEYfaByQ.js";
import { S as Sparkles, Z as Zap } from "./premium-Bn9eQttf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1", key: "bkv52" }],
  ["path", { d: "M12 8v13", key: "1c76mn" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7", key: "6wjy6b" }],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl"
    }
  ]
];
const Gift = createLucideIcon("gift", __iconNode);
const AD_DURATION = 5;
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function AdModal({
  isOpen,
  onComplete,
  adNumber = 1,
  totalAds = 1,
  context = "upload"
}) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = reactExports.useState(AD_DURATION);
  const [canClaim, setCanClaim] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(AD_DURATION);
    setCanClaim(false);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);
  const progress = secondsLeft / AD_DURATION;
  const dashOffset = CIRCUMFERENCE * progress;
  const unlockText = context === "upload" ? tLang("ad_unlocked_message", lang) : tLang("ad.continue", lang);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[9999] flex items-end sm:items-center justify-center",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      "data-ocid": "ad.modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/70 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "relative bg-card border border-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl overflow-hidden z-10",
            initial: { y: 80, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: 80, opacity: 0 },
            transition: { type: "spring", damping: 26, stiffness: 300 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-3 pb-1 sm:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 rounded-full bg-muted-foreground/30" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium tracking-wider uppercase", children: tLang("ad.advertisement", lang) }),
                totalAds > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: [
                  adNumber,
                  " ",
                  tLang("ad.of", lang),
                  " ",
                  totalAds
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-5 pb-4 text-center space-y-3 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 26, className: "text-primary-foreground" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground", children: tLang("ad_watch_title", lang) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Fieldspend · Expense tracking for field sales pros" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/20 rounded-xl px-4 py-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: tLang("ad.no_ads_premium", lang) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "₹49/month · Unlimited receipts · No watermark" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-16 h-16", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        className: "-rotate-90 w-full h-full",
                        viewBox: "0 0 72 72",
                        "aria-hidden": "true",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "circle",
                            {
                              cx: "36",
                              cy: "36",
                              r: RADIUS,
                              fill: "none",
                              strokeWidth: "4",
                              className: "stroke-muted"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.circle,
                            {
                              cx: "36",
                              cy: "36",
                              r: RADIUS,
                              fill: "none",
                              strokeWidth: "4",
                              strokeLinecap: "round",
                              className: "stroke-primary",
                              strokeDasharray: CIRCUMFERENCE,
                              animate: { strokeDashoffset: dashOffset },
                              transition: { duration: 1, ease: "linear" }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: canClaim ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        initial: { scale: 0 },
                        animate: { scale: 1 },
                        transition: {
                          type: "spring",
                          stiffness: 350,
                          damping: 18
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 22, className: "text-secondary" })
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold font-mono text-foreground", children: secondsLeft }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: canClaim ? unlockText : `${tLang("ad_countdown", lang)} ${secondsLeft}s` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "flex-1 text-xs text-muted-foreground h-10",
                      onClick: () => navigate({ to: "/settings" }),
                      "data-ocid": "ad.upgrade_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13, className: "mr-1 text-secondary" }),
                        tLang("ad.upgrade_now", lang)
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      className: "flex-1",
                      animate: canClaim ? { scale: [1, 1.04, 1] } : {},
                      transition: {
                        repeat: canClaim ? Number.POSITIVE_INFINITY : 0,
                        duration: 1.4
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "sm",
                          className: "w-full h-10 text-sm font-semibold gap-1.5",
                          disabled: !canClaim,
                          onClick: onComplete,
                          "data-ocid": "ad.claim_reward_button",
                          children: canClaim ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { size: 14 }),
                            tLang("ad_claim_reward", lang)
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs opacity-60", children: [
                            tLang("ad_countdown", lang),
                            " ",
                            secondsLeft,
                            "s"
                          ] })
                        }
                      )
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
export {
  AdModal as A,
  CircleAlert as C
};

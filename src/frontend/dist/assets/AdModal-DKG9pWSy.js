import { c as createLucideIcon, a as useAppStore, u as useNavigate, r as reactExports, j as jsxRuntimeExports, t as tLang, X } from "./index-NKFMDfSM.js";
import { B as Button } from "./index-i7t4yTMw.js";
import { A as AnimatePresence } from "./index-COFaHO_8.js";
import { m as motion } from "./proxy-sPmYolkV.js";
import { S as Sparkles } from "./premium-DdpwIwfL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
const AD_DURATION = 5;
function AdModal({
  isOpen,
  onComplete,
  adNumber = 1,
  totalAds = 1
}) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = reactExports.useState(AD_DURATION);
  const [canSkip, setCanSkip] = reactExports.useState(false);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(AD_DURATION);
    setCanSkip(false);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[9999] flex items-center justify-center p-4",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      "data-ocid": "ad.modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/60 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "relative bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden z-10",
            initial: { scale: 0.9, y: 24 },
            animate: { scale: 1, y: 0 },
            exit: { scale: 0.9, y: 24 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium tracking-wider uppercase", children: tLang("ad.advertisement", lang) }),
                totalAds > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  adNumber,
                  " ",
                  tLang("ad.of", lang),
                  " ",
                  totalAds
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 px-6 py-8 text-center space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 28, className: "text-primary-foreground" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground", children: "Fieldspend" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Expense tracking for field sales pros" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/20 rounded-xl px-4 py-3 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-primary", children: tLang("ad.no_ads_premium", lang) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "₹49/month · Unlimited receipts · No watermark" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border bg-background space-y-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full bg-primary rounded-full",
                    initial: { width: "100%" },
                    animate: {
                      width: canSkip ? "0%" : `${secondsLeft / AD_DURATION * 100}%`
                    },
                    transition: { duration: 1, ease: "linear" }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  !canSkip ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    tLang("ad.ends_in", lang),
                    " ",
                    secondsLeft,
                    " ",
                    tLang("ad.seconds", lang)
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-secondary font-medium", children: "✓ Done" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        className: "text-xs text-muted-foreground h-8 px-3",
                        onClick: () => navigate({ to: "/settings" }),
                        "data-ocid": "ad.upgrade_button",
                        children: tLang("ad.upgrade_now", lang)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        className: "h-8 px-4 text-xs gap-1",
                        disabled: !canSkip,
                        onClick: onComplete,
                        "data-ocid": "ad.continue_button",
                        children: canSkip ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
                          tLang("ad.continue", lang)
                        ] }) : `${secondsLeft}s`
                      }
                    )
                  ] })
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

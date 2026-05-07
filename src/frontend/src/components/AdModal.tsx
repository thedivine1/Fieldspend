import { Button } from "@/components/ui/button";
import { tLang } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "@tanstack/react-router";
import { GiftIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  adNumber?: number;
  totalAds?: number;
  /** Context hint shown in the ad — 'upload' or 'report' */
  context?: "upload" | "report";
}

const AD_DURATION = 5; // seconds
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function AdModal({
  isOpen,
  onComplete,
  adNumber = 1,
  totalAds = 1,
  context = "upload",
}: AdModalProps) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION);
  const [canClaim, setCanClaim] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset and start countdown whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(AD_DURATION);
    setCanClaim(false);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  // Fraction of timer remaining (1 → 0)
  const progress = secondsLeft / AD_DURATION;
  const dashOffset = CIRCUMFERENCE * progress;

  const unlockText =
    context === "upload"
      ? tLang("ad_unlocked_message", lang)
      : tLang("ad.continue", lang);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-ocid="ad.modal"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/70 backdrop-blur-sm" />

          {/* Ad Card — bottom-sheet on mobile, centered on desktop */}
          <motion.div
            className="relative bg-card border border-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl overflow-hidden z-10"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Top label */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
              <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                {tLang("ad.advertisement", lang)}
              </span>
              {totalAds > 1 && (
                <span className="text-xs font-medium text-muted-foreground">
                  {adNumber} {tLang("ad.of", lang)} {totalAds}
                </span>
              )}
            </div>

            {/* Ad creative area */}
            <div className="px-5 pt-5 pb-4 text-center space-y-3 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/5">
              {/* Brand icon */}
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <SparklesIcon size={26} className="text-primary-foreground" />
                </div>
              </div>

              {/* Watch title */}
              <div>
                <p className="font-display font-bold text-base text-foreground">
                  {tLang("ad_watch_title", lang)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fieldspend · Expense tracking for field sales pros
                </p>
              </div>

              {/* Upgrade nudge */}
              <div className="bg-card border border-primary/20 rounded-xl px-4 py-2.5">
                <p className="text-sm font-semibold text-primary">
                  {tLang("ad.no_ads_premium", lang)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ₹49/month · Unlimited receipts · No watermark
                </p>
              </div>
            </div>

            {/* Countdown + CTA */}
            <div className="px-5 py-4 space-y-3">
              {/* Animated countdown ring */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-16 h-16">
                  <svg
                    className="-rotate-90 w-full h-full"
                    viewBox="0 0 72 72"
                    aria-hidden="true"
                  >
                    {/* Track */}
                    <circle
                      cx="36"
                      cy="36"
                      r={RADIUS}
                      fill="none"
                      strokeWidth="4"
                      className="stroke-muted"
                    />
                    {/* Progress */}
                    <motion.circle
                      cx="36"
                      cy="36"
                      r={RADIUS}
                      fill="none"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="stroke-primary"
                      strokeDasharray={CIRCUMFERENCE}
                      animate={{ strokeDashoffset: dashOffset }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {canClaim ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 18,
                        }}
                      >
                        <GiftIcon size={22} className="text-secondary" />
                      </motion.div>
                    ) : (
                      <span className="text-lg font-bold font-mono text-foreground">
                        {secondsLeft}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {canClaim
                    ? unlockText
                    : `${tLang("ad_countdown", lang)} ${secondsLeft}s`}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-xs text-muted-foreground h-10"
                  onClick={() => navigate({ to: "/settings" })}
                  data-ocid="ad.upgrade_button"
                >
                  <ZapIcon size={13} className="mr-1 text-secondary" />
                  {tLang("ad.upgrade_now", lang)}
                </Button>

                <motion.div
                  className="flex-1"
                  animate={canClaim ? { scale: [1, 1.04, 1] } : {}}
                  transition={{
                    repeat: canClaim ? Number.POSITIVE_INFINITY : 0,
                    duration: 1.4,
                  }}
                >
                  <Button
                    size="sm"
                    className="w-full h-10 text-sm font-semibold gap-1.5"
                    disabled={!canClaim}
                    onClick={onComplete}
                    data-ocid="ad.claim_reward_button"
                  >
                    {canClaim ? (
                      <>
                        <GiftIcon size={14} />
                        {tLang("ad_claim_reward", lang)}
                      </>
                    ) : (
                      <span className="text-xs opacity-60">
                        {tLang("ad_countdown", lang)} {secondsLeft}s
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

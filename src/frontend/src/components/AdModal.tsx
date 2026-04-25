import { Button } from "@/components/ui/button";
import { tLang } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "@tanstack/react-router";
import { SparklesIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  adNumber?: number;
  totalAds?: number;
}

const AD_DURATION = 5; // seconds

export default function AdModal({
  isOpen,
  onComplete,
  adNumber = 1,
  totalAds = 1,
}: AdModalProps) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION);
  const [canSkip, setCanSkip] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset and start countdown whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(AD_DURATION);
    setCanSkip(false);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-ocid="ad.modal"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />

          {/* Ad Card */}
          <motion.div
            className="relative bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden z-10"
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 24 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
              <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                {tLang("ad.advertisement", lang)}
              </span>
              {totalAds > 1 && (
                <span className="text-xs text-muted-foreground">
                  {adNumber} {tLang("ad.of", lang)} {totalAds}
                </span>
              )}
            </div>

            {/* Ad creative */}
            <div className="relative bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 px-6 py-8 text-center space-y-3">
              {/* Brand mark */}
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <SparklesIcon size={28} className="text-primary-foreground" />
                </div>
              </div>

              <div>
                <p className="font-display font-bold text-xl text-foreground">
                  Fieldspend
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Expense tracking for field sales pros
                </p>
              </div>

              {/* CTA message */}
              <div className="bg-card border border-primary/20 rounded-xl px-4 py-3 mt-2">
                <p className="text-sm font-semibold text-primary">
                  {tLang("ad.no_ads_premium", lang)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ₹49/month · Unlimited receipts · No watermark
                </p>
              </div>
            </div>

            {/* Countdown + action */}
            <div className="px-4 py-3 border-t border-border bg-background space-y-2.5">
              {/* Progress bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "100%" }}
                  animate={{
                    width: canSkip
                      ? "0%"
                      : `${(secondsLeft / AD_DURATION) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                {!canSkip ? (
                  <p className="text-xs text-muted-foreground">
                    {tLang("ad.ends_in", lang)} {secondsLeft}{" "}
                    {tLang("ad.seconds", lang)}
                  </p>
                ) : (
                  <p className="text-xs text-secondary font-medium">✓ Done</p>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-muted-foreground h-8 px-3"
                    onClick={() => navigate({ to: "/settings" })}
                    data-ocid="ad.upgrade_button"
                  >
                    {tLang("ad.upgrade_now", lang)}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-4 text-xs gap-1"
                    disabled={!canSkip}
                    onClick={onComplete}
                    data-ocid="ad.continue_button"
                  >
                    {canSkip ? (
                      <>
                        <XIcon size={12} />
                        {tLang("ad.continue", lang)}
                      </>
                    ) : (
                      `${secondsLeft}s`
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

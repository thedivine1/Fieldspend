import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDismiss: () => void;
}

export function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 2000ms: start fade at 1700ms, unmount at 2000ms
    const fadeTimer = setTimeout(() => setFading(true), 1700);
    const dismissTimer = setTimeout(() => onDismiss(), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  function handleClick() {
    setFading(true);
    setTimeout(() => onDismiss(), 300);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Tap to continue"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        opacity: fading ? 0 : 1,
        transition: "opacity 300ms ease-out",
        cursor: "pointer",
        border: "none",
        padding: 0,
      }}
      className="bg-background flex flex-col items-center justify-center select-none w-full"
    >
      {/* Subtle radial glow behind logo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-5">
        <img
          src="/logo.svg"
          alt="Fieldspend"
          width={140}
          height={140}
          style={{ width: 140, height: "auto" }}
          className="drop-shadow-lg"
          draggable={false}
        />

        <div className="flex flex-col items-center gap-1">
          <span
            className="text-3xl font-bold tracking-tight text-primary"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            Fieldspend
          </span>
          <span className="text-sm text-muted-foreground tracking-widest uppercase">
            Expense Tracker
          </span>
        </div>
      </div>

      {/* Subtle bottom hint */}
      <p className="absolute bottom-12 text-xs text-muted-foreground/50 tracking-wide">
        Tap anywhere to continue
      </p>
    </button>
  );
}

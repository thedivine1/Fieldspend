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
        background: "#ffffff",
      }}
      className="flex flex-col items-center justify-center select-none w-full"
    >
      <div className="relative flex flex-col items-center gap-6">
        <img
          src="/fieldspend-splash.png"
          alt="Fieldspend"
          width={220}
          height={220}
          style={{
            width: 220,
            height: "auto",
            animation: "splashZoom 1.2s ease-out forwards",
          }}
          draggable={false}
        />

        <span className="text-sm tracking-widest uppercase" style={{ color: "#888", letterSpacing: "0.2em" }}>
          Expense Tracker
        </span>
      </div>

      {/* Subtle bottom hint */}
      <p className="absolute bottom-12 text-xs" style={{ color: "rgba(0,0,0,0.25)" }}>
        Tap anywhere to continue
      </p>

      <style>{`
        @keyframes splashZoom {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </button>
  );
}

import { tLang } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CameraIcon,
  FileTextIcon,
  ImageIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  labelKey: string;
  ocid: string;
}

const navItems: NavItem[] = [
  {
    to: "/gallery",
    icon: <ImageIcon size={22} />,
    labelKey: "nav.gallery",
    ocid: "nav.gallery",
  },
  {
    to: "/reports",
    icon: <FileTextIcon size={22} />,
    labelKey: "nav.reports",
    ocid: "nav.reports",
  },
  {
    to: "/settings",
    icon: <SettingsIcon size={22} />,
    labelKey: "nav.settings",
    ocid: "nav.settings",
  },
];

// ─── PWA Install Banner ───────────────────────────────────────────────────────

const INSTALL_DISMISSED_KEY = "pwa_install_dismissed";

function InstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on mobile devices and if not previously dismissed
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === "true";
    // Don't show if already running as installed PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as { standalone?: boolean }).standalone === true);

    if (isMobile && !dismissed && !isStandalone) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex items-start gap-3"
      data-ocid="install.banner"
    >
      <span className="text-lg leading-none mt-0.5">📲</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary leading-snug">
          Install on your phone
        </p>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
          Open in Chrome → tap ⋮ menu → <strong>Add to Home Screen</strong>
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="flex-shrink-0 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Dismiss install prompt"
        data-ocid="install.dismiss_button"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const { isDarkMode, toggleDarkMode, currentLanguage } = useAppStore();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span
              className="font-display font-bold text-lg leading-tight text-foreground"
              data-ocid="header.app_name"
            >
              Field<span className="text-primary">spend</span>
            </span>
            {currentLanguage !== "en" && (
              <span className="text-xs text-muted-foreground leading-none mt-0.5">
                {tLang("app.name", currentLanguage)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            data-ocid="header.dark_mode_toggle"
          >
            {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>
        </div>

        {/* PWA Install Hint */}
        <InstallBanner />
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-card border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        data-ocid="bottom_nav"
      >
        <div className="flex items-end h-16 relative">
          {/* Left nav items */}
          {navItems.slice(0, 1).map((item) => (
            <NavLink
              key={item.to}
              item={item}
              isActive={location.pathname === item.to}
            />
          ))}

          {/* Center upload button */}
          <div className="flex-1 flex items-center justify-center">
            <Link
              to="/upload"
              className="flex flex-col items-center gap-0.5 -mt-5"
              data-ocid="nav.upload_button"
            >
              <span
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-smooth ${
                  location.pathname === "/upload"
                    ? "bg-secondary"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                <CameraIcon size={24} className="text-primary-foreground" />
              </span>
              <span className="text-[10px] font-medium text-muted-foreground mt-1">
                {tLang("nav.upload", currentLanguage)}
              </span>
            </Link>
          </div>

          {/* Right nav items */}
          {navItems.slice(1).map((item) => (
            <NavLink
              key={item.to}
              item={item}
              isActive={location.pathname === item.to}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const { currentLanguage } = useAppStore();
  return (
    <Link
      to={item.to}
      className={`nav-item flex-1 h-full ${isActive ? "nav-item-active" : "nav-item-inactive"}`}
      data-ocid={item.ocid}
    >
      <span>{item.icon}</span>
      <span className="text-[10px]">
        {tLang(item.labelKey, currentLanguage)}
      </span>
    </Link>
  );
}

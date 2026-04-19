import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES, t } from "@/lib/i18n";
import {
  createDefaultProfile,
  getBetaDaysLeft,
  isBetaPeriodActive,
} from "@/lib/premium";
import { useAppStore } from "@/store/useAppStore";
import type { Language } from "@/types";
import {
  Building2,
  CheckCircle2,
  Clock,
  CrownIcon,
  GlobeIcon,
  HeartHandshake,
  Info,
  MailIcon,
  MoonIcon,
  Share2,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Upgrade Modal ─────────────────────────────────────────────────────────────

function UpgradeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-ocid="settings.upgrade_modal"
        >
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close modal"
          />
          <motion.div
            className="relative bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10"
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 24 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <SparklesIcon size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-base">
                  Coming Soon!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Premium upgrades
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-2">
              Premium upgrades are coming soon! You'll be notified as soon as
              payments are available.
            </p>
            <p className="text-xs text-muted-foreground mb-5">
              In the meantime, enjoy full beta access — unlimited receipts,
              clean PDF exports (no watermark), priority support.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                data-ocid="settings.upgrade_modal.cancel_button"
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => {
                  toast.success("We'll notify you when premium is available!");
                  onClose();
                }}
                data-ocid="settings.upgrade_modal.confirm_button"
              >
                Notify Me
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
  ocid,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  ocid: string;
}) {
  return (
    <section
      className="bg-card border border-border rounded-xl overflow-hidden"
      data-ocid={ocid}
    >
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-primary">{icon}</span>
        <h3 className="font-semibold text-foreground text-sm tracking-wide">
          {title}
        </h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const {
    userProfile,
    saveProfile,
    setLanguage,
    currentLanguage,
    toggleDarkMode,
    isDarkMode,
  } = useAppStore();

  const [name, setName] = useState(userProfile?.name ?? "");
  const [company, setCompany] = useState(userProfile?.companyName ?? "");
  const [nameError, setNameError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setCompany(userProfile.companyName ?? "");
    }
  }, [userProfile]);

  const isBeta = userProfile ? isBetaPeriodActive(userProfile) : true;
  const betaDaysLeft = userProfile ? getBetaDaysLeft(userProfile) : 60;
  const isActualPremium = userProfile?.isPremium ?? false;

  async function handleSaveProfile() {
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
    setNameError("");
    setIsSaving(true);
    const profile = userProfile
      ? {
          ...userProfile,
          name: name.trim(),
          companyName: company.trim() || undefined,
        }
      : createDefaultProfile(
          `user-${Date.now()}`,
          name.trim(),
          company.trim() || undefined,
        );
    await saveProfile(profile);
    setIsSaving(false);
    toast.success(t("status.saved"));
  }

  function handleShareApp() {
    if (typeof navigator.share === "function") {
      navigator
        .share({
          title: "SalesExpense Pro",
          text: "Track field expenses easily — SalesExpense Pro for sales professionals!",
          url: window.location.origin,
        })
        .catch(() => null);
    } else {
      navigator.clipboard.writeText(window.location.origin).then(() => {
        toast.success("App link copied to clipboard!");
      });
    }
  }

  return (
    <>
      <UpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />

      <div className="px-4 py-5 space-y-4 pb-24" data-ocid="settings.page">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-xl text-foreground">
            {t("nav.settings")}
          </h2>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            v1.0 Beta
          </Badge>
        </div>

        {/* Beta Banner */}
        {isBeta && !isActualPremium && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3"
            data-ocid="settings.beta_banner"
          >
            <ShieldCheckIcon
              size={18}
              className="text-amber-500 mt-0.5 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                🎉 You're in the 60-day free beta!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receipts include a watermark during beta. Upgrade before it
                expires to keep premium features.
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <Clock size={12} className="text-amber-500" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  {betaDaysLeft} days remaining of 60
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Profile ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Section
            icon={<UserIcon size={15} />}
            title="Profile"
            ocid="settings.profile_section"
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t("profile.name")} *</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                  }}
                  onBlur={() => {
                    if (!name.trim()) setNameError("Name is required");
                  }}
                  data-ocid="settings.name_input"
                  aria-describedby={nameError ? "name-error" : undefined}
                />
                {nameError && (
                  <p
                    id="name-error"
                    className="text-xs text-destructive"
                    data-ocid="settings.name_input.field_error"
                  >
                    {nameError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company">
                  <Building2 size={12} className="inline mr-1 opacity-60" />
                  Company Name{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="company"
                  placeholder="Company (Optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  data-ocid="settings.company_input"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                data-ocid="settings.save_profile_button"
              >
                <CheckCircle2 size={15} className="mr-2" />
                {isSaving ? "Saving…" : t("profile.save")}
              </Button>
            </div>
          </Section>
        </motion.div>

        {/* ── Account Status ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Section
            icon={<CrownIcon size={15} />}
            title={t("premium.title")}
            ocid="settings.account_section"
          >
            {/* Status badge row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Current Plan
              </span>
              {isActualPremium ? (
                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 gap-1.5">
                  <StarIcon size={11} />
                  Premium Active
                </Badge>
              ) : isBeta ? (
                <Badge className="bg-secondary/20 text-secondary border border-secondary/40 gap-1.5">
                  <ShieldCheckIcon size={11} />🎉 Beta — {betaDaysLeft} days
                  left
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground gap-1.5"
                >
                  Free — 10 receipts/day
                </Badge>
              )}
            </div>

            {/* Beta note */}
            {isBeta && !isActualPremium && (
              <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 mb-4">
                Beta users get full access free. Upgrade before your beta
                expires to keep premium features.
              </p>
            )}

            {/* Premium cards — show for beta or free users */}
            {!isActualPremium && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Choose a Plan
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Monthly card */}
                  <div
                    className="bg-muted/30 border border-border rounded-xl p-3.5 text-center space-y-1.5 hover:border-primary/40 transition-smooth"
                    data-ocid="settings.monthly_plan_card"
                  >
                    <p className="text-xs text-muted-foreground font-medium">
                      Monthly
                    </p>
                    <p className="font-display font-bold text-xl text-foreground">
                      ₹99
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                    <ul className="text-xs text-muted-foreground text-left space-y-1 mt-2">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2
                          size={11}
                          className="text-secondary mt-0.5 shrink-0"
                        />
                        Unlimited receipts
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2
                          size={11}
                          className="text-secondary mt-0.5 shrink-0"
                        />
                        No watermark
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2
                          size={11}
                          className="text-secondary mt-0.5 shrink-0"
                        />
                        Priority support
                      </li>
                    </ul>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 text-xs border-border hover:border-primary hover:text-primary"
                      onClick={() => setUpgradeModalOpen(true)}
                      data-ocid="settings.monthly_upgrade_button"
                    >
                      Upgrade
                    </Button>
                  </div>

                  {/* Annual card */}
                  <div
                    className="bg-primary/8 border border-primary/30 rounded-xl p-3.5 text-center space-y-1.5 relative"
                    data-ocid="settings.annual_plan_card"
                  >
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0 bg-accent text-accent-foreground whitespace-nowrap">
                      Most Popular
                    </Badge>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      Annual
                    </p>
                    <p className="font-display font-bold text-xl text-primary">
                      ₹49
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                    <p className="text-xs font-semibold text-secondary">
                      Save 50%!
                    </p>
                    <ul className="text-xs text-muted-foreground text-left space-y-1 mt-1">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2
                          size={11}
                          className="text-secondary mt-0.5 shrink-0"
                        />
                        Everything in Monthly
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2
                          size={11}
                          className="text-secondary mt-0.5 shrink-0"
                        />
                        Best value
                      </li>
                    </ul>
                    <Button
                      size="sm"
                      className="w-full mt-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => setUpgradeModalOpen(true)}
                      data-ocid="settings.annual_upgrade_button"
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Premium active message */}
            {isActualPremium && (
              <div className="flex items-center gap-2 text-sm text-secondary font-medium">
                <CheckCircle2 size={16} />
                You have full premium access — enjoy!
              </div>
            )}
          </Section>
        </motion.div>

        {/* ── Language ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Section
            icon={<GlobeIcon size={15} />}
            title="Language / भाषा"
            ocid="settings.language_section"
          >
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => {
                const isActive = currentLanguage === lang.value;
                return (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.value as Language);
                      toast.success(`Language set to ${lang.label}`);
                    }}
                    className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-medium border transition-smooth text-center ${
                      isActive
                        ? "bg-secondary/15 border-secondary text-secondary"
                        : "bg-muted/30 border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                    }`}
                    aria-pressed={isActive}
                    data-ocid={`settings.language_btn.${lang.value}`}
                  >
                    <span className="block text-base leading-tight">
                      {lang.native}
                    </span>
                    {lang.value !== "en" && (
                      <span className="text-xs opacity-70">{lang.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Section>
        </motion.div>

        {/* ── Appearance ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Section
            icon={isDarkMode ? <MoonIcon size={15} /> : <SunIcon size={15} />}
            title="Appearance"
            ocid="settings.appearance_section"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? "bg-primary/15 text-primary"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  {isDarkMode ? <MoonIcon size={18} /> : <SunIcon size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Dark Mode
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isDarkMode ? "Dark theme active" : "Light theme active"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-primary"
                data-ocid="settings.dark_mode_switch"
                aria-label="Toggle dark mode"
              />
            </div>
          </Section>
        </motion.div>

        {/* ── About ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Section
            icon={<Info size={15} />}
            title="About"
            ocid="settings.about_section"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <HeartHandshake
                    size={22}
                    className="text-primary-foreground"
                  />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">
                    SalesExpense Pro
                  </p>
                  <p className="text-xs text-muted-foreground">
                    v1.0 Beta · For field sales professionals across India
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <a
                  href="mailto:support@salesexpensepro.com"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-smooth group"
                  data-ocid="settings.support_email_link"
                >
                  <MailIcon
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-sm text-foreground">
                    support@salesexpensepro.com
                  </span>
                </a>

                <button
                  type="button"
                  onClick={handleShareApp}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-smooth group w-full text-left"
                  data-ocid="settings.share_app_button"
                >
                  <Share2
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-sm text-foreground">Share App</span>
                </button>
              </div>
            </div>
          </Section>
        </motion.div>

        {/* ── Footer ── */}
        <div className="text-center py-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SalesExpense Pro. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

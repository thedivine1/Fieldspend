import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES, tLang } from "@/lib/i18n";
import {
  applyPremiumToProfile,
  createDefaultProfile,
  getBetaDaysLeft,
  getPremiumExpiryLabel,
  isAdminUser,
  isBetaPeriodActive,
} from "@/lib/premium";
import {
  type PlanType,
  type RazorpayResponse,
  getPremiumExpiry,
  openRazorpayCheckout,
} from "@/lib/razorpay";
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
  ZapIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Plan Card ───────────────────────────────────────────────────────────────────────

interface PlanCardProps {
  type: PlanType;
  price: string;
  billing: string;
  savings?: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  isProcessing: boolean;
  onSelect: (plan: PlanType) => void;
  ocid: string;
}

function PlanCard({
  type,
  price,
  billing,
  savings,
  isPopular,
  features,
  ctaLabel,
  isProcessing,
  onSelect,
  ocid,
}: PlanCardProps) {
  return (
    <div
      className={`flex-1 rounded-xl p-3 space-y-2 relative overflow-hidden transition-smooth ${
        isPopular
          ? "bg-primary/10 border border-primary/40 shadow-sm"
          : "bg-muted/30 border border-border hover:border-primary/30"
      }`}
      data-ocid={ocid}
    >
      {isPopular && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0 bg-accent text-accent-foreground whitespace-nowrap">
          Most Popular
        </Badge>
      )}
      <div className={isPopular ? "mt-2" : ""}>
        <p className="text-[11px] leading-snug text-muted-foreground font-medium break-words">
          {billing}
        </p>
        <p
          className={`font-display font-bold text-xl mt-0.5 ${
            isPopular ? "text-primary" : "text-foreground"
          }`}
        >
          {price}
        </p>
        {savings && (
          <p className="text-[11px] font-semibold text-secondary mt-0.5 leading-snug">
            {savings}
          </p>
        )}
      </div>
      <ul className="space-y-1.5 mt-2">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground"
          >
            <CheckCircle2
              size={10}
              className="text-secondary mt-0.5 shrink-0"
            />
            <span className="break-words min-w-0 whitespace-normal">{f}</span>
          </li>
        ))}
      </ul>
      <Button
        size="sm"
        disabled={isProcessing}
        className={`w-full mt-2 text-[11px] gap-1.5 ${
          isPopular
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : "bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/30"
        }`}
        onClick={() => onSelect(type)}
        data-ocid={`${ocid}.upgrade_button`}
      >
        {isProcessing ? (
          <span className="animate-pulse">{ctaLabel}…</span>
        ) : (
          <>
            <ZapIcon size={12} />
            {ctaLabel}
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Upgrade Modal (Razorpay) ──────────────────────────────────────────────────

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (plan: PlanType) => void;
  lang: Language;
  userName: string;
  userEmail: string;
}

function UpgradeModal({
  open,
  onClose,
  onSuccess,
  lang,
  userName,
  userEmail,
}: UpgradeModalProps) {
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !processingPlan) onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, processingPlan]);

  const handleSelectPlan = useCallback(
    async (plan: PlanType) => {
      setProcessingPlan(plan);

      // Generate a pseudo order ID (in production, this comes from your backend)
      // The backend canister would call createRazorpayOrder and return a real orderId
      const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      await openRazorpayCheckout({
        planType: plan,
        orderId,
        userName: userName || "Fieldspend User",
        userEmail: userEmail || "",
        onSuccess: (response: RazorpayResponse) => {
          setProcessingPlan(null);
          onSuccess(plan);
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          // In production: call backend verifyPayment(orderId, paymentId, signature)
          void response;
        },
        onDismiss: () => {
          setProcessingPlan(null);
          // silent — no error shown
        },
      }).catch(() => {
        // silent fallback
        setProcessingPlan(null);
      });
    },
    [userName, userEmail, onSuccess],
  );

  const planFeatures = {
    monthly: [
      tLang("settings.unlimited_receipts", lang),
      tLang("settings.no_watermark", lang),
      tLang("settings.no_ads", lang),
      tLang("settings.priority_support", lang),
    ],
    annual: [
      tLang("settings.everything_monthly", lang),
      tLang("settings.no_ads", lang),
      tLang("settings.best_value", lang),
    ],
  };

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
            onClick={() => !processingPlan && onClose()}
            aria-label="Close modal"
          />
          <motion.div
            className="relative bg-card border border-border rounded-2xl p-5 max-w-sm w-full shadow-2xl z-10"
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 24 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <SparklesIcon size={20} className="text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-foreground text-base truncate">
                  {tLang("upgrade.title", lang)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tLang("upgrade.subtitle", lang)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !processingPlan && onClose()}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                aria-label="Close"
                data-ocid="settings.upgrade_modal.close_button"
              >
                ✕
              </button>
            </div>

            {/* Plan Cards */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <PlanCard
                type="monthly"
                price="₹99"
                billing={`${tLang("plan.monthly", lang)} • ${tLang("settings.per_month", lang)}`}
                features={planFeatures.monthly}
                ctaLabel={tLang("btn.upgrade", lang)}
                isProcessing={processingPlan === "monthly"}
                onSelect={handleSelectPlan}
                ocid="settings.monthly_plan_card"
              />
              <PlanCard
                type="annual"
                price="₹49"
                billing={`${tLang("plan.annual", lang)} • ₹588/yr`}
                savings={tLang("plan.savings", lang)}
                isPopular
                features={planFeatures.annual}
                ctaLabel={tLang("btn.upgrade", lang)}
                isProcessing={processingPlan === "annual"}
                onSelect={handleSelectPlan}
                ocid="settings.annual_plan_card"
              />
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground">
              Secure payment via Razorpay · Cancel anytime
            </p>

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs text-muted-foreground"
              onClick={onClose}
              disabled={!!processingPlan}
              data-ocid="settings.upgrade_modal.cancel_button"
            >
              {tLang("settings.close", lang)}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────────────────

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
        <span className="text-primary shrink-0">{icon}</span>
        <h3 className="font-semibold text-foreground text-xs tracking-wide truncate">
          {title}
        </h3>
      </div>
      <div className="p-4 overflow-hidden">{children}</div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const {
    userProfile,
    saveProfile,
    setLanguage,
    currentLanguage,
    toggleDarkMode,
    isDarkMode,
  } = useAppStore();
  const lang = currentLanguage;

  const [name, setName] = useState(userProfile?.name ?? "");
  const [company, setCompany] = useState(userProfile?.companyName ?? "");
  const [email, setEmail] = useState(userProfile?.email ?? "");
  const [nameError, setNameError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setCompany(userProfile.companyName ?? "");
      setEmail(userProfile.email ?? "");
    }
  }, [userProfile]);

  const isBeta = isBetaPeriodActive();
  const betaDaysLeft = getBetaDaysLeft();
  const isAdmin = userProfile ? isAdminUser(userProfile) : false;
  const isActualPremium = userProfile?.isPremium ?? false;
  const premiumExpiryLabel = userProfile
    ? getPremiumExpiryLabel(userProfile)
    : "";

  async function handleSaveProfile() {
    if (!name.trim()) {
      setNameError(tLang("settings.name_required", lang));
      return;
    }
    setNameError("");
    setIsSaving(true);
    const profile = userProfile
      ? {
          ...userProfile,
          name: name.trim(),
          companyName: company.trim() || undefined,
          email: email.trim() || undefined,
        }
      : createDefaultProfile(
          `user-${Date.now()}`,
          name.trim(),
          company.trim() || undefined,
          email.trim() || undefined,
        );
    await saveProfile(profile);
    setIsSaving(false);
    toast.success(tLang("status.saved", lang));
  }

  async function handlePaymentSuccess(plan: PlanType) {
    setUpgradeModalOpen(false);
    if (!userProfile) return;
    const expiryDate = getPremiumExpiry(plan);
    const updatedProfile = applyPremiumToProfile(userProfile, plan, expiryDate);
    await saveProfile(updatedProfile);
    toast.success(
      lang === "hi"
        ? "प्रीमियम एक्टिव — धन्यवाद!"
        : lang === "mr"
          ? "प्रीमियम सक्रिय — धन्यवाद!"
          : "Premium activated — thank you!",
      { duration: 5000 },
    );
  }

  function handleShareApp() {
    if (typeof navigator.share === "function") {
      navigator
        .share({
          title: "Fieldspend",
          text: "Track field expenses easily — Fieldspend for sales professionals!",
          url: window.location.origin,
        })
        .catch(() => null);
    } else {
      navigator.clipboard
        .writeText(window.location.origin)
        .then(() => toast.success(tLang("settings.app_link_copied", lang)));
    }
  }

  return (
    <>
      <UpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        lang={lang}
        userName={userProfile?.name ?? ""}
        userEmail={userProfile?.email ?? ""}
      />

      <div
        className="px-3 sm:px-4 py-5 space-y-4 pb-24"
        data-ocid="settings.page"
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-1 gap-2">
          <h2 className="font-display font-bold text-xl text-foreground truncate">
            {tLang("settings.title", lang)}
          </h2>
          <Badge
            variant="outline"
            className="text-xs text-muted-foreground shrink-0"
          >
            v1.0 Beta
          </Badge>
        </div>

        {/* Admin banner */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-2.5"
            data-ocid="settings.admin_banner"
          >
            <ShieldCheckIcon
              size={16}
              className="text-primary mt-0.5 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground leading-snug">
                🔑 Admin Access — All features unlocked
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 break-all">
                coepianraider@gmail.com · No limits · No ads · No watermark
              </p>
            </div>
          </motion.div>
        )}

        {/* Beta banner */}
        {isBeta && !isActualPremium && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5"
            data-ocid="settings.beta_banner"
          >
            <ShieldCheckIcon
              size={16}
              className="text-amber-500 mt-0.5 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground leading-snug">
                🎉 {tLang("settings.beta_title", lang)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed break-words">
                {tLang("settings.beta_desc", lang)}
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Clock size={12} className="text-amber-500 shrink-0" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  {betaDaysLeft} {tLang("settings.beta_days_remaining", lang)}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {tLang("settings.beta_ends_date", lang)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Post-beta ended message */}
        {!isBeta && !isActualPremium && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/8 border border-destructive/20 rounded-xl p-3 flex items-start gap-2.5"
            data-ocid="settings.beta_ended_banner"
          >
            <ZapIcon size={16} className="text-destructive mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-destructive leading-snug">
                {tLang("beta_has_ended", lang)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 break-words">
                {tLang("upgrade_required", lang)} — ₹49/month for unlimited
                receipts &amp; no ads.
              </p>
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
            title={tLang("settings.profile", lang)}
            ocid="settings.profile_section"
          >
            <div className="space-y-3">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">{tLang("profile.name", lang)} *</Label>
                <Input
                  id="name"
                  placeholder={tLang("profile.name", lang)}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                  }}
                  onBlur={() => {
                    if (!name.trim())
                      setNameError(tLang("settings.name_required", lang));
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

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  <MailIcon size={12} className="inline mr-1 opacity-60" />
                  {tLang("profile.email", lang)}{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="settings.email_input"
                />
                <p className="text-xs text-muted-foreground">
                  Enter admin email for full permanent access
                </p>
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <Label htmlFor="company">
                  <Building2 size={12} className="inline mr-1 opacity-60" />
                  {tLang("settings.company_label", lang)}{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    ({tLang("settings.company_optional", lang)})
                  </span>
                </Label>
                <Input
                  id="company"
                  placeholder={tLang("profile.company", lang)}
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
                {isSaving
                  ? tLang("settings.saving", lang)
                  : tLang("profile.save", lang)}
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
            title={tLang("premium.title", lang)}
            ocid="settings.account_section"
          >
            {/* Status badge */}
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {tLang("settings.current_plan", lang)}
              </span>
              {isAdmin ? (
                <Badge
                  className="bg-primary/20 text-primary border border-primary/40 gap-1 text-xs"
                  data-ocid="settings.admin_badge"
                >
                  <ShieldCheckIcon size={10} />
                  Premium (Admin)
                </Badge>
              ) : isActualPremium ? (
                <Badge
                  className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 gap-1 text-xs"
                  data-ocid="settings.premium_badge"
                >
                  <StarIcon size={10} />
                  {tLang("premium.active", lang)}
                </Badge>
              ) : isBeta ? (
                <Badge className="bg-secondary/20 text-secondary border border-secondary/40 gap-1 text-xs">
                  <ShieldCheckIcon size={10} />✨ Beta — {betaDaysLeft}d left
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground gap-1 text-xs"
                >
                  Free — 10/day
                </Badge>
              )}
            </div>

            {/* Premium active detail */}
            {isActualPremium && !isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2.5 mb-4 flex items-center gap-2"
                data-ocid="settings.premium_active_banner"
              >
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {tLang("premium.active", lang)}
                  </p>
                  {premiumExpiryLabel && (
                    <p className="text-xs text-muted-foreground">
                      {tLang("premium.expiry", lang)}: {premiumExpiryLabel}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Beta countdown note */}
            {isBeta && !isActualPremium && !isAdmin && (
              <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
                <Clock size={12} className="text-amber-500 shrink-0" />
                <span>
                  {tLang("settings.beta_ends_date", lang)} · {betaDaysLeft}{" "}
                  {tLang("settings.days_remaining", lang)}
                </span>
              </div>
            )}

            {/* Admin message */}
            {isAdmin && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium flex-wrap mb-4">
                <ShieldCheckIcon size={16} className="shrink-0" />
                <span>Full access, no restrictions, no ads ever</span>
              </div>
            )}

            {/* Upgrade CTAs */}
            {!isActualPremium && !isAdmin && (
              <Button
                className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                onClick={() => setUpgradeModalOpen(true)}
                data-ocid="settings.upgrade_to_premium_button"
              >
                <SparklesIcon size={15} />
                {tLang("action.upgrade", lang)}
              </Button>
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
            title={`${tLang("settings.language", lang)} / भाषा`}
            ocid="settings.language_section"
          >
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {LANGUAGES.map((l) => {
                const isActive = currentLanguage === l.value;
                return (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => {
                      setLanguage(l.value as Language);
                      toast.success(
                        `${tLang("settings.lang_set", l.value as Language)} ${l.label}`,
                      );
                    }}
                    className={`py-2 px-1 rounded-lg text-[10px] font-medium border transition-smooth text-center leading-snug overflow-hidden ${isActive ? "bg-secondary/15 border-secondary text-secondary" : "bg-muted/30 border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground"}`}
                    aria-pressed={isActive}
                    data-ocid={`settings.language_btn.${l.value}`}
                  >
                    <span className="block font-semibold text-[10px] leading-tight break-words whitespace-normal">
                      {l.native}
                    </span>
                    {l.value !== "en" && (
                      <span className="text-[9px] opacity-70 block leading-tight break-words whitespace-normal">
                        {l.label}
                      </span>
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
            title={tLang("settings.appearance", lang)}
            ocid="settings.appearance_section"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}
                >
                  {isDarkMode ? <MoonIcon size={18} /> : <SunIcon size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {tLang("settings.dark_mode", lang)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {isDarkMode
                      ? tLang("settings.dark_active", lang)
                      : tLang("settings.light_active", lang)}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-primary shrink-0"
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
            title={tLang("settings.about", lang)}
            ocid="settings.about_section"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <HeartHandshake
                    size={20}
                    className="text-primary-foreground"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-foreground truncate">
                    Fieldspend
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    v1.0 Beta · For field sales professionals across India
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <a
                  href="mailto:touchport.llp@gmail.com"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-smooth group"
                  data-ocid="settings.support_email_link"
                >
                  <MailIcon
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                  />
                  <span className="text-sm text-foreground truncate">
                    touchport.llp@gmail.com
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
                    className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                  />
                  <span className="text-sm text-foreground">
                    {tLang("settings.share_app", lang)}
                  </span>
                </button>
              </div>
            </div>
          </Section>
        </motion.div>
      </div>
    </>
  );
}

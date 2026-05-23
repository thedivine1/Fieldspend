import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES, tLang } from "@/lib/i18n";
import { createDefaultProfile, isAdminUser } from "@/lib/premium";
import { useAppStore } from "@/store/useAppStore";
import type { Language } from "@/types";
import {
  Building2,
  CheckCircle2,
  GlobeIcon,
  HeartHandshake,
  Info,
  MailIcon,
  MoonIcon,
  Share2,
  ShieldCheckIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Section Wrapper ──────────────────────────────────────────────────────────────

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

// ─── Main Page ───────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setCompany(userProfile.companyName ?? "");
      setEmail(userProfile.email ?? "");
    }
  }, [userProfile]);

  const isAdmin = userProfile ? isAdminUser(userProfile) : false;

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
          v1.0
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
          <ShieldCheckIcon size={16} className="text-primary mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground leading-snug">
              🔑 Admin Access — All features unlocked
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 break-all">
              coepianraider@gmail.com · No limits · Full access
            </p>
          </div>
        </motion.div>
      )}

      {/* Open access banner */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/10 border border-secondary/30 rounded-xl p-3 flex items-start gap-2.5"
          data-ocid="settings.open_access_banner"
        >
          <ShieldCheckIcon
            size={16}
            className="text-secondary mt-0.5 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground leading-snug">
              ✅ Open Access — All features free during testing
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unlimited receipt uploads · Free PDF generation
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

      {/* ── Language ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                  className={`py-2 px-1 rounded-lg text-[10px] font-medium border transition-smooth text-center leading-snug overflow-hidden ${
                    isActive
                      ? "bg-secondary/15 border-secondary text-secondary"
                      : "bg-muted/30 border-border text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                  }`}
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
        transition={{ delay: 0.15 }}
      >
        <Section
          icon={isDarkMode ? <MoonIcon size={15} /> : <SunIcon size={15} />}
          title={tLang("settings.appearance", lang)}
          ocid="settings.appearance_section"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isDarkMode
                    ? "bg-primary/15 text-primary"
                    : "bg-accent/15 text-accent"
                }`}
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
        transition={{ delay: 0.2 }}
      >
        <Section
          icon={<Info size={15} />}
          title={tLang("settings.about", lang)}
          ocid="settings.about_section"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <HeartHandshake size={20} className="text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-foreground truncate">
                  Fieldspend
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  v1.0 · For field sales professionals across India
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
  );
}

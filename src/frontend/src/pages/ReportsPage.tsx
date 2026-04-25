import AdModal from "@/components/AdModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MONTH_KEYS, tLang } from "@/lib/i18n";
import { generateExpenseReport } from "@/lib/pdf";
import {
  hasPremiumAccess,
  isAdminUser,
  isBetaPeriodActive,
} from "@/lib/premium";
import { useAppStore } from "@/store/useAppStore";
import type { CategoryTotal } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  DownloadIcon,
  FileTextIcon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UploadIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

const CATEGORY_ICONS: Record<string, string> = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋",
};

const CATEGORY_COLORS: Record<string, string> = {
  cab: "badge-cab",
  train: "badge-train",
  bus: "badge-bus",
  flight: "badge-flight",
  hotel: "badge-hotel",
  meal: "badge-meal",
  other: "badge-other",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildEmailBody(
  breakdown: CategoryTotal[],
  grandTotal: number,
  monthName: string,
  year: number,
  lang: import("@/types").Language,
): string {
  const lines = breakdown.map(
    (item) =>
      `${tLang(`cat.${item.category}`, lang)}: ${formatCurrency(item.total)} (${item.count} ${item.count === 1 ? tLang("report.items", lang) : tLang("report.items_plural", lang)})`,
  );
  lines.push(
    "",
    `${tLang("report.total", lang)}: ${formatCurrency(grandTotal)}`,
  );
  return `${tLang("report.title", lang)} - ${monthName} ${year}\n\n${lines.join("\n")}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryRow({
  item,
  grandTotal,
  index,
  lang,
}: {
  item: CategoryTotal;
  grandTotal: number;
  index: number;
  lang: import("@/types").Language;
}) {
  const pct = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-center gap-3 py-3"
      data-ocid={`reports.category.${index + 1}`}
    >
      <span className="text-base shrink-0 w-6 text-center">
        {CATEGORY_ICONS[item.category] ?? "📋"}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <Badge
            variant="outline"
            className={`text-xs shrink-0 ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other}`}
          >
            {tLang(`cat.${item.category}`, lang)}
          </Badge>
          <span className="text-xs text-muted-foreground ml-2 shrink-0">
            {item.count}{" "}
            {item.count === 1
              ? tLang("report.items", lang)
              : tLang("report.items_plural", lang)}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: index * 0.06 + 0.2, duration: 0.5 }}
          />
        </div>
      </div>
      <div className="text-right shrink-0 min-w-[72px]">
        <p className="text-sm font-bold text-foreground font-mono">
          {formatCurrency(item.total)}
        </p>
        <p className="text-xs text-muted-foreground">{pct.toFixed(0)}%</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportsPage() {
  const {
    receipts,
    userProfile,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    currentLanguage,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // Ad gate for report generation
  const [showAd, setShowAd] = useState(false);
  const [pendingPdf, setPendingPdf] = useState(false);

  const monthNames = useMemo(
    () => MONTH_KEYS.map((key) => tLang(key, currentLanguage)),
    [currentLanguage],
  );

  const filteredReceipts = useMemo(
    () =>
      receipts.filter((r) => {
        const d = new Date(r.date);
        return (
          d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
        );
      }),
    [receipts, selectedMonth, selectedYear],
  );

  const breakdown = useMemo<CategoryTotal[]>(() => {
    const map = new Map<string, CategoryTotal>();
    for (const r of filteredReceipts) {
      const existing = map.get(r.category);
      if (existing) {
        existing.total += r.amount ?? 0;
        existing.count += 1;
      } else {
        map.set(r.category, {
          category: r.category,
          total: r.amount ?? 0,
          count: 1,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filteredReceipts]);

  const grandTotal = useMemo(
    () => filteredReceipts.reduce((s, r) => s + (r.amount ?? 0), 0),
    [filteredReceipts],
  );

  const isPremium = userProfile ? hasPremiumAccess(userProfile) : false;
  const isAdmin = userProfile ? isAdminUser(userProfile) : false;
  const isFreeUser = !isPremium;
  const betaActive = isBetaPeriodActive();

  // Ads apply post-beta for free non-admin users
  const shouldShowAd = !betaActive && isFreeUser && !isAdmin;

  const monthName = monthNames[selectedMonth - 1];
  const reportTitle = `${monthName} ${selectedYear}`;

  function handleMonthChange(v: string) {
    setSelectedMonth(Number(v));
    setPdfReady(false);
    setPdfBlob(null);
  }

  function handleYearChange(v: string) {
    setSelectedYear(Number(v));
    setPdfReady(false);
    setPdfBlob(null);
  }

  async function runPdfGeneration() {
    if (!userProfile) return;
    if (filteredReceipts.length === 0) return;
    setIsGenerating(true);
    setPdfReady(false);
    try {
      const blob = await generateExpenseReport(
        userProfile,
        filteredReceipts,
        selectedMonth,
        selectedYear,
        isFreeUser,
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expense-report-${selectedYear}-${String(selectedMonth).padStart(2, "0")}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setPdfBlob(blob);
      setPdfReady(true);
      toast.success(tLang("status.saved", currentLanguage));
    } catch {
      // silent
    } finally {
      setIsGenerating(false);
    }
  }

  function handleGenerate() {
    if (shouldShowAd) {
      setPendingPdf(true);
      setShowAd(true);
    } else {
      runPdfGeneration();
    }
  }

  function handleAdComplete() {
    setShowAd(false);
    if (pendingPdf) {
      setPendingPdf(false);
      runPdfGeneration();
    }
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `${tLang("report.title", currentLanguage)}: ${reportTitle} — ${tLang("report.total", currentLanguage)}: ${formatCurrency(grandTotal)}\n\n(PDF attached separately)`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function handleEmail() {
    const subject = encodeURIComponent(
      `${tLang("report.title", currentLanguage)} - ${reportTitle}`,
    );
    const body = encodeURIComponent(
      buildEmailBody(
        breakdown,
        grandTotal,
        monthName,
        selectedYear,
        currentLanguage,
      ),
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }

  const hasNoProfile = !userProfile || !userProfile.name;
  const hasNoReceipts = filteredReceipts.length === 0;

  return (
    <>
      <AdModal
        isOpen={showAd}
        onComplete={handleAdComplete}
        adNumber={1}
        totalAds={1}
      />

      <div className="px-4 py-5 space-y-5 pb-8" data-ocid="reports.page">
        {/* Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              {tLang("report.title", currentLanguage)}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tLang("report.month", currentLanguage)}
            </p>
          </div>
          {isPremium && (
            <div className="flex items-center gap-1 bg-secondary/10 border border-secondary/20 rounded-full px-3 py-1">
              <ShieldCheckIcon size={13} className="text-secondary" />
              <span className="text-xs font-semibold text-secondary">
                Premium
              </span>
            </div>
          )}
        </div>

        {/* Month / Year Selector */}
        <div className="flex gap-2.5" data-ocid="reports.period_selector">
          <Select
            value={String(selectedMonth)}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger
              className="flex-1 bg-card"
              data-ocid="reports.month_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((m, i) => (
                <SelectItem key={MONTH_KEYS[i]} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(selectedYear)} onValueChange={handleYearChange}>
            <SelectTrigger
              className="w-28 bg-card"
              data-ocid="reports.year_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Watermark banner — free users during beta */}
        {isFreeUser && betaActive && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3"
            data-ocid="reports.watermark_banner"
          >
            <AlertCircleIcon
              size={16}
              className="text-amber-500 shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {tLang("report.watermark_note", currentLanguage)}
              </p>
            </div>
            <Link to="/settings">
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 text-xs border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                data-ocid="reports.upgrade_button"
              >
                <SparklesIcon size={12} className="mr-1" />{" "}
                {tLang("report.upgrade", currentLanguage)}
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Post-beta ad notice */}
        {shouldShowAd && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-muted/40 border border-border rounded-xl px-4 py-3"
            data-ocid="reports.ad_notice"
          >
            <AlertCircleIcon
              size={16}
              className="text-muted-foreground shrink-0 mt-0.5"
            />
            <p className="text-sm text-muted-foreground flex-1">
              A short ad plays before PDF download.{" "}
              <Link
                to="/settings"
                className="underline text-primary font-medium"
              >
                Upgrade
              </Link>{" "}
              to remove ads.
            </p>
          </motion.div>
        )}

        {/* Premium badge */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-secondary/8 border border-secondary/20 rounded-xl px-4 py-2.5"
            data-ocid="reports.premium_badge"
          >
            <CheckCircle2Icon size={15} className="text-secondary shrink-0" />
            <p className="text-sm font-medium text-secondary">
              Clean PDF — {tLang("settings.no_watermark", currentLanguage)}
            </p>
          </motion.div>
        )}

        {/* Profile missing notice */}
        {hasNoProfile && (
          <div
            className="flex items-center gap-3 bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3"
            data-ocid="reports.profile_missing"
          >
            <AlertCircleIcon size={15} className="text-destructive shrink-0" />
            <p className="text-sm text-destructive flex-1">
              {tLang("report.set_profile", currentLanguage)}{" "}
              <Link to="/settings" className="underline font-semibold">
                {tLang("report.set_profile2", currentLanguage)}
              </Link>{" "}
              {tLang("report.set_profile3", currentLanguage)}
            </p>
          </div>
        )}

        {/* Report preview card */}
        {!hasNoProfile && !hasNoReceipts && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            data-ocid="reports.preview_card"
          >
            <div className="bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent border-b border-border px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold text-base text-foreground truncate">
                    {userProfile?.name}
                  </p>
                  {userProfile?.companyName && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {userProfile.companyName}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {tLang("report.title", currentLanguage)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {reportTitle}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {tLang("report.total", currentLanguage)}
                </p>
                <p className="font-display font-bold text-3xl text-primary">
                  {formatCurrency(grandTotal)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredReceipts.length}{" "}
                  {tLang("report.receipts", currentLanguage)} ·{" "}
                  {breakdown.length}{" "}
                  {tLang("report.categories", currentLanguage)}
                </p>
              </div>
            </div>

            <div className="px-5 py-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {tLang("report.category_breakdown", currentLanguage)}
              </p>
              <div className="divide-y divide-border">
                {breakdown.map((item, i) => (
                  <CategoryRow
                    key={item.category}
                    item={item}
                    grandTotal={grandTotal}
                    index={i}
                    lang={currentLanguage}
                  />
                ))}
              </div>
              <Separator className="my-3" />
              <div
                className="flex items-center justify-between py-1"
                data-ocid="reports.total_row"
              >
                <span className="text-sm font-bold text-foreground">
                  {tLang("report.total", currentLanguage)}
                </span>
                <span className="text-sm font-bold text-primary font-mono">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 pb-1">
                📎 {filteredReceipts.length}{" "}
                {filteredReceipts.length === 1
                  ? tLang("report.images_attached", currentLanguage)
                  : tLang("report.images_attached_plural", currentLanguage)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {hasNoReceipts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-12 text-center px-4"
            data-ocid="reports.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileTextIcon size={28} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">
              {tLang("report.no_receipts", currentLanguage)} {reportTitle}
            </p>
            <p className="text-sm text-muted-foreground mb-5">{monthName}</p>
            <Link to="/">
              <Button
                variant="outline"
                className="gap-2"
                data-ocid="reports.upload_cta"
              >
                <UploadIcon size={15} />{" "}
                {tLang("report.add_first", currentLanguage)}
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Generate PDF button */}
        {!hasNoReceipts && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Button
              className="w-full h-12 text-base font-semibold rounded-xl shadow-md gap-2 bg-primary hover:bg-primary/90"
              onClick={handleGenerate}
              disabled={isGenerating || hasNoProfile}
              data-ocid="reports.generate_button"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  {tLang("report.generating", currentLanguage)}
                </>
              ) : (
                <>
                  <DownloadIcon size={18} />
                  {tLang("action.download", currentLanguage)}
                </>
              )}
            </Button>
            {isFreeUser && !isGenerating && betaActive && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                {tLang("report.watermark_note", currentLanguage)}
              </p>
            )}
            {shouldShowAd && !isGenerating && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                📺 A short ad will play before download
              </p>
            )}
          </motion.div>
        )}

        {/* Share buttons */}
        {pdfReady && pdfBlob && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
            data-ocid="reports.share_section"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
              {tLang("report.share", currentLanguage)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:bg-muted/40 transition-smooth active:scale-95"
                data-ocid="reports.whatsapp_button"
              >
                <SiWhatsapp size={20} className="text-[#25D366] shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    WhatsApp
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {tLang("action.share", currentLanguage)}
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={handleEmail}
                className="flex items-center justify-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:bg-muted/40 transition-smooth active:scale-95"
                data-ocid="reports.email_button"
              >
                <MailIcon size={20} className="text-primary shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    Email
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {tLang("action.share", currentLanguage)}
                  </p>
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center px-2">
              💡 {tLang("report.whatsapp_note", currentLanguage)}
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}

import AdModal from "@/components/AdModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Share2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

const CATEGORY_ICONS: Record<string, string> = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  localBus: "🚌",
  auto: "🛺",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋",
};

const CATEGORY_COLORS: Record<string, string> = {
  cab: "badge-cab",
  train: "badge-train",
  bus: "badge-bus",
  localBus: "badge-bus",
  auto: "badge-cab",
  flight: "badge-flight",
  hotel: "badge-hotel",
  meal: "badge-meal",
  other: "badge-other",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Returns last day of the month as YYYY-MM-DD for the filename */
function getPeriodEndDate(month: number, year: number): string {
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

// ─── PDF Preview Modal ────────────────────────────────────────────────────────

function PdfPreviewModal({
  open,
  onClose,
  blob,
  filename,
}: {
  open: boolean;
  onClose: () => void;
  blob: Blob;
  filename: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const objectUrlRef = useRef<string | null>(null);
  const prevBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    if (!open) {
      // Revoke and clear when dialog closes
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
        setObjectUrl(null);
      }
      return;
    }
    // Only create a new object URL when the blob actually changes
    if (prevBlobRef.current === blob && objectUrlRef.current) return;
    // Revoke any previous URL first
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    prevBlobRef.current = blob;
    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    setObjectUrl(url);
    setCanShare(typeof navigator.share === "function");
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [open, blob]);

  function handleDownload() {
    // Always create a fresh object URL for download to avoid stale revoked URLs
    const freshUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = freshUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke after a short delay to ensure the download starts
    setTimeout(() => URL.revokeObjectURL(freshUrl), 5000);
  }

  async function handleShare() {
    if (!canShare) {
      handleDownload();
      return;
    }
    const file = new File([blob], filename, { type: "application/pdf" });
    try {
      await navigator.share({ files: [file], title: filename });
    } catch {
      // user cancelled or share unsupported — fall back to download silently
      handleDownload();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-w-[96vw] w-full sm:max-w-2xl p-0 overflow-hidden rounded-2xl"
        data-ocid="pdf_preview.dialog"
      >
        <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-0">
          <DialogTitle className="text-sm font-semibold truncate text-foreground max-w-[70%]">
            {filename}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted/60 transition-colors"
            aria-label="Close preview"
            data-ocid="pdf_preview.close_button"
          >
            <XIcon size={16} />
          </button>
        </DialogHeader>

        {/* PDF preview — iframe is more reliable than <object> on mobile */}
        <div
          className="bg-muted/30 mx-4 rounded-xl overflow-hidden"
          style={{ height: "55vh" }}
        >
          {objectUrl ? (
            <iframe
              src={objectUrl}
              title="PDF preview"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="inline-block w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-4 py-4">
          <Button
            className="flex-1 gap-2 h-11 rounded-xl"
            onClick={handleDownload}
            data-ocid="pdf_preview.download_button"
          >
            <DownloadIcon size={16} />
            Download PDF
          </Button>
          {canShare && (
            <Button
              variant="outline"
              className="flex-1 gap-2 h-11 rounded-xl"
              onClick={handleShare}
              data-ocid="pdf_preview.share_button"
            >
              <Share2Icon size={16} />
              Share
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── CategoryRow ──────────────────────────────────────────────────────────────

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
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Ad gate
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
  const shouldShowAd = !betaActive && isFreeUser && !isAdmin;

  const monthName = monthNames[selectedMonth - 1];
  const reportTitle = `${monthName} ${selectedYear}`;
  const pdfFilename = `Expense_Report_${getPeriodEndDate(selectedMonth, selectedYear)}.pdf`;

  function handleMonthChange(v: string) {
    setSelectedMonth(Number(v));
    setPdfBlob(null);
  }

  function handleYearChange(v: string) {
    setSelectedYear(Number(v));
    setPdfBlob(null);
  }

  async function runPdfGeneration() {
    if (!userProfile) return;
    if (filteredReceipts.length === 0) return;
    setIsGenerating(true);
    try {
      const blob = await generateExpenseReport(
        userProfile,
        filteredReceipts,
        selectedMonth,
        selectedYear,
        isFreeUser,
      );
      if (!blob) {
        // Generation failed silently — fall back to direct download attempt
        setIsGenerating(false);
        return;
      }
      setPdfBlob(blob);
      // On mobile, trigger direct download without showing preview modal
      // to avoid iframe compatibility issues on older Android WebViews
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = pdfFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        setShowPreview(true);
      }
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

      {pdfBlob && (
        <PdfPreviewModal
          open={showPreview}
          onClose={() => setShowPreview(false)}
          blob={pdfBlob}
          filename={pdfFilename}
        />
      )}

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
                <SparklesIcon size={12} className="mr-1" />
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
                  : tLang(
                      "report.images_attached_plural",
                      currentLanguage,
                    )}{" "}
                · 3 per row thumbnails
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
            className="space-y-2"
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

            {/* Re-open preview button if blob exists */}
            {pdfBlob && !isGenerating && (
              <Button
                variant="outline"
                className="w-full h-10 rounded-xl gap-2 text-sm"
                onClick={() => setShowPreview(true)}
                data-ocid="reports.reopen_preview_button"
              >
                <Share2Icon size={15} />
                View / Share Last Report
              </Button>
            )}

            {isFreeUser && !isGenerating && betaActive && (
              <p className="text-xs text-center text-muted-foreground">
                {tLang("report.watermark_note", currentLanguage)}
              </p>
            )}
            {shouldShowAd && !isGenerating && (
              <p className="text-xs text-center text-muted-foreground">
                📺 A short ad will play before download
              </p>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}

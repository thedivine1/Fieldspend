import AdModal from "@/components/AdModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getDailyCount } from "@/lib/db";
import { tLang } from "@/lib/i18n";
import { processImage } from "@/lib/imageProcessing";
import {
  detectAmount,
  detectCategory,
  detectDate,
  extractTextFromImage,
} from "@/lib/ocr";
import {
  canUploadReceipt,
  hasPremiumAccess,
  isAdminUser,
  isBetaPeriodActive,
} from "@/lib/premium";
import { useAppStore } from "@/store/useAppStore";
import type { Category, Receipt } from "@/types";
import { FREE_DAILY_LIMIT } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CameraIcon,
  CheckCircle2Icon,
  ImageIcon,
  Loader2Icon,
  RefreshCwIcon,
  SparklesIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Upload counter helpers ───────────────────────────────────────────────────

const UPLOAD_COUNT_KEY = "fieldspend_upload_count";
const UPLOAD_DATE_KEY = "fieldspend_upload_date";

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getUploadCount(): number {
  const storedDate = localStorage.getItem(UPLOAD_DATE_KEY);
  if (storedDate !== getTodayStr()) {
    localStorage.setItem(UPLOAD_DATE_KEY, getTodayStr());
    localStorage.setItem(UPLOAD_COUNT_KEY, "0");
    return 0;
  }
  return Number(localStorage.getItem(UPLOAD_COUNT_KEY) ?? "0");
}

function incrementUploadCount(): number {
  const count = getUploadCount() + 1;
  localStorage.setItem(UPLOAD_COUNT_KEY, String(count));
  return count;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type QueueStatus = "pending" | "processing" | "done" | "error";

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  imageDataUrl: string | null;
  status: QueueStatus;
  date: string;
  category: Category;
  amount: string;
  notes: string;
  ocrAttempted: boolean;
  ocrFailed: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  "cab",
  "auto",
  "localBus",
  "train",
  "bus",
  "flight",
  "hotel",
  "meal",
  "other",
];

const CATEGORY_COLORS: Record<Category, string> = {
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

const CATEGORY_ICONS: Record<Category, string> = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  localBus: "🚐",
  auto: "🛺",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋",
};

const MAX_QUEUE = 10;
const TODAY = new Date().toISOString().split("T")[0];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface QueueItemCardProps {
  item: QueueItem;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function QueueItemCard({
  item,
  index,
  isActive,
  onSelect,
  onRemove,
}: QueueItemCardProps) {
  const { currentLanguage } = useAppStore();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-smooth ${
        isActive
          ? "border-primary/60 bg-primary/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
      onClick={onSelect}
      data-ocid={`upload.queue_item.${index + 1}`}
    >
      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
        <img
          src={item.previewUrl}
          alt={`Receipt ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {item.status === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2Icon size={16} className="text-primary animate-spin" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {CATEGORY_ICONS[item.category]}{" "}
            {tLang(`cat.${item.category}`, currentLanguage)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {item.date || tLang("status.processing", currentLanguage)}
          {item.amount ? ` · ₹${item.amount}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.status === "done" && (
          <CheckCircle2Icon size={18} className="text-secondary" />
        )}
        {item.status === "error" && (
          <AlertCircleIcon size={18} className="text-destructive" />
        )}
        {item.status === "pending" && (
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
        )}
        <button
          type="button"
          className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
          data-ocid={`upload.queue_remove.${index + 1}`}
        >
          <XIcon size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const navigate = useNavigate();
  const { addReceipt, userProfile, currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [limitChecked, setLimitChecked] = useState(false);

  // Ad gate: show 2 ads every 5 uploads (post-beta free users only)
  const [adGateQueue, setAdGateQueue] = useState<number>(0); // how many ads left to show
  const [currentAd, setCurrentAd] = useState<number>(0); // 1 or 2
  const [pendingSaveAfterAd, setPendingSaveAfterAd] = useState(false);

  useEffect(() => {
    getDailyCount(TODAY)
      .then((count) => {
        setDailyCount(count);
        setLimitChecked(true);
      })
      .catch(() => setLimitChecked(true));
  }, []);

  const isAdmin = userProfile ? isAdminUser(userProfile) : false;
  const isPremium = userProfile ? hasPremiumAccess(userProfile) : false;
  const limitReached =
    !isPremium && limitChecked && dailyCount >= FREE_DAILY_LIMIT;
  const canUpload =
    isPremium ||
    !limitChecked ||
    (limitChecked && dailyCount < FREE_DAILY_LIMIT);
  const slotsLeft = Math.max(0, FREE_DAILY_LIMIT - dailyCount);

  // Ads apply only post-beta for free non-admin users
  const shouldShowAds = !isBetaPeriodActive() && !isPremium && !isAdmin;

  const activeItem = queue[activeIndex] ?? null;

  // ─── OCR ──────────────────────────────────────────────────────────────────

  const processFile = useCallback(async (itemId: string, file: File) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === itemId ? { ...q, status: "processing" } : q)),
    );
    try {
      // Full pipeline: EXIF rotate → edge-detect crop → resize → compress
      const processedDataUrl = await processImage(file);
      setQueue((prev) =>
        prev.map((q) =>
          q.id === itemId
            ? {
                ...q,
                previewUrl: processedDataUrl,
                imageDataUrl: processedDataUrl,
              }
            : q,
        ),
      );
      const text = await extractTextFromImage(processedDataUrl);
      const detectedDate = detectDate(text);
      const detectedCategory = detectCategory(text);
      const detectedAmount = detectAmount(text);
      setQueue((prev) =>
        prev.map((q) =>
          q.id === itemId
            ? {
                ...q,
                status: "pending",
                ocrAttempted: true,
                ocrFailed: false,
                date: detectedDate ?? q.date,
                category: detectedCategory ?? q.category,
                amount:
                  detectedAmount != null ? String(detectedAmount) : q.amount,
              }
            : q,
        ),
      );
    } catch {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === itemId
            ? { ...q, status: "pending", ocrAttempted: true, ocrFailed: true }
            : q,
        ),
      );
    }
  }, []);

  // ─── File handling ────────────────────────────────────────────────────────

  const enqueueFiles = useCallback(
    (files: File[]) => {
      if (!canUpload) {
        toast.error(tLang("status.limit_reached", lang));
        return;
      }
      const remaining = MAX_QUEUE - queue.length;
      const toAdd = files
        .slice(0, remaining)
        .filter((f) => f.type.startsWith("image/"));
      if (toAdd.length === 0) return;
      const newItems: QueueItem[] = toAdd.map((file) => ({
        id: generateId(),
        file,
        previewUrl: URL.createObjectURL(file),
        imageDataUrl: null,
        status: "pending",
        date: TODAY,
        category: "other",
        amount: "",
        notes: "",
        ocrAttempted: false,
        ocrFailed: false,
      }));
      setQueue((prev) => {
        const updated = [...prev, ...newItems];
        if (prev.length === 0) setActiveIndex(0);
        return updated;
      });
      for (const item of newItems) processFile(item.id, item.file);
    },
    [canUpload, queue.length, processFile, lang],
  );

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) enqueueFiles([f]);
    e.target.value = "";
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) enqueueFiles(Array.from(files));
    e.target.value = "";
  };

  const removeItem = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((prev) => Math.min(prev, Math.max(0, queue.length - 2)));
  };

  function updateActive(patch: Partial<QueueItem>) {
    setQueue((prev) =>
      prev.map((q, i) => (i === activeIndex ? { ...q, ...patch } : q)),
    );
  }

  // ─── Save ─────────────────────────────────────────────────────────────────

  async function doSaveAll() {
    const toSave = queue.filter((q) => q.status !== "done");
    if (toSave.length === 0) {
      navigate({ to: "/gallery" });
      return;
    }
    setIsSaving(true);
    let savedCount = 0;
    for (const item of toSave) {
      try {
        const imageData =
          item.imageDataUrl ??
          (await (async () => {
            // Fallback: process the original file if imageDataUrl is missing
            try {
              return await processImage(item.file);
            } catch {
              return await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result;
                  if (typeof result === "string") resolve(result);
                  else reject(new Error("Failed to read file"));
                };
                reader.onerror = reject;
                reader.readAsDataURL(item.file);
              });
            }
          })());
        const receipt: Receipt = {
          id: generateId(),
          imageData,
          date: item.date,
          category: item.category,
          amount: item.amount ? Number.parseFloat(item.amount) : undefined,
          notes: item.notes || undefined,
          createdAt: Date.now(),
        };
        await addReceipt(receipt);
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "done" } : q)),
        );
        savedCount++;

        // Track upload count for ad gate (post-beta free users only)
        if (shouldShowAds) {
          const newCount = incrementUploadCount();
          if (newCount % 5 === 0) {
            // Trigger 2-ad gate after this batch
            setPendingSaveAfterAd(true);
          }
        }
      } catch {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "error" } : q)),
        );
      }
    }
    setIsSaving(false);
    if (savedCount > 0) {
      toast.success(
        savedCount === 1
          ? tLang("status.saved", lang)
          : `${savedCount} receipts saved!`,
      );

      // If ad gate triggered, show 2 ads before navigating
      if (shouldShowAds && pendingSaveAfterAd) {
        setPendingSaveAfterAd(false);
        setAdGateQueue(2);
        setCurrentAd(1);
      } else {
        navigate({ to: "/gallery" });
      }
    }
  }

  function handleSaveAll() {
    doSaveAll();
  }

  // Ad 1 complete → show ad 2
  function handleAdComplete() {
    const remaining = adGateQueue - 1;
    setAdGateQueue(remaining);
    if (remaining > 0) {
      setCurrentAd((prev) => prev + 1);
    } else {
      setCurrentAd(0);
      navigate({ to: "/gallery" });
    }
  }

  // ─── Limit reached screen ─────────────────────────────────────────────────

  if (limitChecked && limitReached) {
    return (
      <div
        className="px-4 py-8 flex flex-col items-center text-center gap-6"
        data-ocid="upload.limit_reached"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center"
        >
          <AlertCircleIcon size={36} className="text-destructive" />
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Daily Limit Reached
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            {tLang("status.limit_reached", lang)} — Upgrade to Premium for
            unlimited uploads.
          </p>
        </div>
        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Today's usage</span>
            <span>
              {dailyCount}/{FREE_DAILY_LIMIT}
            </span>
          </div>
          <Progress
            value={(dailyCount / FREE_DAILY_LIMIT) * 100}
            className="h-2"
            data-ocid="upload.limit_progress"
          />
        </div>
        <div className="w-full space-y-3">
          <Button
            className="w-full gap-2"
            size="lg"
            data-ocid="upload.upgrade_button"
            onClick={() => navigate({ to: "/settings" })}
          >
            <StarIcon size={18} />
            {tLang("action.upgrade", lang)} · ₹49/mo
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: "/gallery" })}
            data-ocid="upload.back_to_gallery"
          >
            View Gallery
          </Button>
        </div>
      </div>
    );
  }

  // ─── Empty / Upload Prompt ────────────────────────────────────────────────

  if (queue.length === 0) {
    return (
      <div className="px-4 py-6 space-y-6" data-ocid="upload.page">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCameraChange}
          aria-label="Camera capture"
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleGalleryChange}
          aria-label="Gallery select"
        />

        {limitChecked && !isPremium && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4 space-y-2"
            data-ocid="upload.usage_bar"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-muted-foreground">
                Today's receipts
              </span>
              <span className="text-xs font-bold text-foreground">
                {dailyCount}/{FREE_DAILY_LIMIT}
              </span>
            </div>
            <Progress
              value={(dailyCount / FREE_DAILY_LIMIT) * 100}
              className="h-1.5"
            />
            {slotsLeft <= 3 && slotsLeft > 0 && (
              <p className="text-xs text-warning">
                Only {slotsLeft} upload{slotsLeft > 1 ? "s" : ""} left today
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center space-y-6"
          data-ocid="upload.dropzone"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ImageIcon size={36} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Add Receipt Photos
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Up to {MAX_QUEUE} receipts at once · OCR auto-reads dates &amp;
                amounts
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-col h-20 gap-2 border-2 hover:border-primary/50 hover:bg-primary/5"
              onClick={() => cameraRef.current?.click()}
              data-ocid="upload.camera_button"
            >
              <CameraIcon size={24} className="text-primary" />
              <span className="text-sm font-medium">
                {tLang("upload.camera", lang)}
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-col h-20 gap-2 border-2 hover:border-primary/50 hover:bg-primary/5"
              onClick={() => galleryRef.current?.click()}
              data-ocid="upload.gallery_button"
            >
              <ImageIcon size={24} className="text-secondary" />
              <span className="text-sm font-medium">
                {tLang("upload.gallery", lang)}
              </span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, HEIC · Hindi &amp; English text supported
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Queue + Form view ────────────────────────────────────────────────────

  return (
    <>
      {/* Ad gate modal — 2 ads after every 5 uploads for post-beta free users */}
      <AdModal
        isOpen={adGateQueue > 0}
        onComplete={handleAdComplete}
        adNumber={currentAd}
        totalAds={2}
      />

      <div className="px-4 py-4 space-y-4" data-ocid="upload.page">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCameraChange}
          aria-label="Camera capture"
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleGalleryChange}
          aria-label="Gallery select"
        />

        {/* Queue header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {queue.length} receipt{queue.length > 1 ? "s" : ""} queued
          </h2>
          {queue.length < MAX_QUEUE && canUpload && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary gap-1.5 h-8"
              onClick={() => galleryRef.current?.click()}
              data-ocid="upload.add_more_button"
            >
              <ImageIcon size={14} /> Add more
            </Button>
          )}
        </div>

        {/* Queue list */}
        <div className="space-y-2" data-ocid="upload.queue_list">
          <AnimatePresence>
            {queue.map((item, i) => (
              <QueueItemCard
                key={item.id}
                item={item}
                index={i}
                isActive={i === activeIndex}
                onSelect={() => setActiveIndex(i)}
                onRemove={() => removeItem(i)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Active item editor */}
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="upload.receipt_editor"
          >
            {/* Image preview */}
            <div className="relative w-full h-52 bg-muted">
              <img
                src={activeItem.previewUrl}
                alt="Receipt preview"
                className="w-full h-full object-cover"
              />

              {activeItem.status === "processing" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2"
                  data-ocid="upload.processing_state"
                >
                  <Loader2Icon
                    size={28}
                    className="text-primary animate-spin"
                  />
                  <p className="text-sm font-medium text-foreground">
                    {tLang("status.processing", lang)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reading receipt with OCR…
                  </p>
                </motion.div>
              )}

              {activeItem.imageDataUrl &&
                !activeItem.ocrFailed &&
                activeItem.ocrAttempted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 text-foreground text-xs font-medium shadow"
                  >
                    ✂️ Optimised
                  </motion.div>
                )}

              {activeItem.ocrAttempted && !activeItem.ocrFailed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shadow-md"
                >
                  <SparklesIcon size={12} /> OCR filled
                </motion.div>
              )}

              {activeItem.ocrFailed && (
                <div className="absolute top-3 left-3 right-3">
                  <div className="bg-destructive/90 text-destructive-foreground text-xs px-3 py-2 rounded-lg flex items-center justify-between gap-2">
                    <span>
                      Couldn't read receipt — fill in details manually
                    </span>
                    <button
                      type="button"
                      className="flex-shrink-0"
                      onClick={() =>
                        processFile(activeItem.id, activeItem.file)
                      }
                      aria-label="Retry OCR"
                      data-ocid="upload.retry_ocr"
                    >
                      <RefreshCwIcon size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={activeItem.date}
                  onChange={(e) => updateActive({ date: e.target.value })}
                  data-ocid="upload.date_input"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-medium">
                  Category
                </Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={activeItem.category}
                    onValueChange={(v) =>
                      updateActive({ category: v as Category })
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className="flex-1"
                      data-ocid="upload.category_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <span className="flex items-center gap-2">
                            <span>{CATEGORY_ICONS[cat]}</span>
                            <span>{tLang(`cat.${cat}`, lang)}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge
                    className={`flex-shrink-0 text-xs ${CATEGORY_COLORS[activeItem.category]}`}
                    variant="secondary"
                  >
                    {CATEGORY_ICONS[activeItem.category]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-medium">
                  Amount (optional)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={activeItem.amount}
                    onChange={(e) => updateActive({ amount: e.target.value })}
                    data-ocid="upload.amount_input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-medium">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Vendor name, purpose…"
                  value={activeItem.notes}
                  maxLength={200}
                  rows={2}
                  className="resize-none text-sm"
                  onChange={(e) => updateActive({ notes: e.target.value })}
                  data-ocid="upload.notes_textarea"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {activeItem.notes.length}/200
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-3 pb-6">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleSaveAll}
            disabled={isSaving || queue.every((q) => q.status === "processing")}
            data-ocid="upload.save_button"
          >
            {isSaving ? (
              <>
                <Loader2Icon size={18} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2Icon size={18} />
                Add to Gallery (
                {queue.filter((q) => q.status !== "done").length})
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => navigate({ to: "/gallery" })}
            data-ocid="upload.discard_button"
          >
            <Trash2Icon size={14} className="mr-1.5" />
            Discard all
          </Button>
        </div>
      </div>
    </>
  );
}

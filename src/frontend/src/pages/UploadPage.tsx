import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addReceipt as dbAddReceipt } from "@/lib/db";
import { tLang } from "@/lib/i18n";
import { processImage, rotateImageByDegrees } from "@/lib/imageProcessing";
import {
  extractOCRData,
  prewarmOcrWorker,
} from "@/lib/ocr";
import { compressToThumbnail } from "@/lib/pdf";
import { useAppStore } from "@/store/useAppStore";
import type { Category, Receipt } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  CameraIcon,
  CheckCircle2Icon,
  ImageIcon,
  Loader2Icon,
  RefreshCwIcon,
  SparklesIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

/** OCR processing lifecycle: idle → processing → done | error */
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

// ─── Draft persistence (synchronous localStorage — never hangs) ──────────────

const DRAFT_KEY = "fieldspend_receipts";

type DraftItem = Omit<QueueItem, "file" | "previewUrl"> & {
  previewUrl: string;
};

type DraftPayload = { items: DraftItem[]; savedAt: string };

/**
 * Synchronously persist upload queue to localStorage.
 * Called after every OCR completion and every field edit.
 * NEVER uses IndexedDB — no async hang risk.
 */
function saveDraft(queue: QueueItem[]): void {
  try {
    const saveable = queue
      .filter((q) => q.imageDataUrl !== null)
      .map(
        ({ file: _file, previewUrl: _prev, ...rest }): DraftItem => ({
          ...rest,
          previewUrl: rest.imageDataUrl as string,
        }),
      );
    if (saveable.length === 0) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const payload: DraftPayload = {
      items: saveable,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    /* silent — storage full or blocked */
  }
}

function loadDraft(): DraftPayload | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as DraftPayload;
    if (data && Array.isArray(data.items) && data.items.length > 0) return data;
  } catch {
    /* silent */
  }
  return null;
}

function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* silent */
  }
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  "cab",
  "auto",
  "localBus",
  "train",
  "bus",
  "flight",
  "hotel",
  "meal",
  "metro",
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
  metro: "badge-train",
  other: "badge-other",
};

const CATEGORY_ICONS: Record<Category, string> = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  localBus: "🚐",
  auto: "🛵",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  metro: "🚇",
  other: "📋",
};

const MAX_QUEUE = 20;
const TODAY = new Date().toISOString().split("T")[0];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface QueueItemCardProps {
  item: QueueItem;
  index: number;
  isActive: boolean;
  showSaved: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function QueueItemCard({
  item,
  index,
  isActive,
  showSaved,
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
          {item.amount ? ` ₹${item.amount}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {showSaved && (
          <span className="text-xs font-medium text-secondary flex items-center gap-1">
            <CheckCircle2Icon size={13} /> Saved
          </span>
        )}
        {item.status === "processing" && !showSaved && (
          <Loader2Icon size={14} className="text-primary animate-spin" />
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
  const { addReceipt, currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [draftBanner, setDraftBanner] = useState<number | null>(null);
  // showSaved[id] = true for 2 seconds after each receipt is saved
  const [showSaved, setShowSaved] = useState<Record<string, boolean>>({});

  const queueRef = useRef<QueueItem[]>(queue);

  // Keep ref in sync so beforeunload can access latest queue without stale closure
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  // Auto-save draft to localStorage on every queue change (sync — never hangs)
  useEffect(() => {
    saveDraft(queue);
  }, [queue]);

  // Restore draft on mount from localStorage
  useEffect(() => {
    prewarmOcrWorker();
    const data = loadDraft();
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return;
    const restored: QueueItem[] = data.items.map(
      (d): QueueItem => ({
        ...d,
        file: new File([], d.id),
        previewUrl: d.imageDataUrl as string,
        status: "done",
      }),
    );
    setQueue(restored);
    setActiveIndex(0);
    setDraftBanner(restored.length);
    // Auto-dismiss banner after 3 seconds
    setTimeout(() => setDraftBanner(null), 3000);
  }, []);

  // Best-effort sync save on tab close / Back navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      // localStorage.setItem is synchronous — safe in beforeunload
      saveDraft(queueRef.current);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveDraft(queueRef.current);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /** Flash green "✓ Saved" for 2 seconds on a queue item */
  const markSaved = useCallback((id: string) => {
    setShowSaved((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setShowSaved((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  }, []);

  const activeItem = queue[activeIndex] ?? null;

  // ─── Per-item save to permanent gallery ──────────────────────────────────────
  /**
   * Saves a single receipt to the permanent gallery (IndexedDB via dbAddReceipt).
   * Also saves the full queue draft to localStorage for recovery.
   * Shows a green "✓ Saved" flash for 2 seconds — no spinner.
   */
  const saveOneReceipt = useCallback(
    async (itemId: string) => {
      try {
        // Read current item state from ref to avoid stale closure
        const current = queueRef.current.find((q) => q.id === itemId);
        if (!current) return;

        const imageData =
          current.imageDataUrl ??
          (await (async () => {
            try {
              return await processImage(current.file);
            } catch {
              return await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result;
                  if (typeof result === "string") resolve(result);
                  else reject(new Error("Failed to read file"));
                };
                reader.onerror = reject;
                reader.readAsDataURL(current.file);
              });
            }
          })());

        const thumbnailData = await compressToThumbnail(imageData) ?? undefined;

        const receipt: Receipt = {
          id: generateId(),
          imageData,
          thumbnailData,
          date: current.date,
          category: current.category,
          amount: current.amount
            ? Number.parseFloat(current.amount)
            : undefined,
          notes: current.notes || undefined,
          createdAt: Date.now(),
        };

        // Save to permanent gallery (IndexedDB)
        await dbAddReceipt(receipt);
        // Also update in-memory store if available
        try {
          addReceipt(receipt);
        } catch {
          /* silent */
        }

        // Save the full queue as draft to localStorage (for recovery of remaining items)
        saveDraft(queueRef.current);

        // Flash green "✓ Saved" for 2 seconds — no spinner
        markSaved(itemId);
      } catch {
        // Silent failure — user can retry via "Save this receipt" button
      }
    },
    [addReceipt, markSaved],
  );

  // ─── OCR + auto-save pipeline ───────────────────────────────────────────────
  /**
   * For each file:
   * 1. Process image (crop/compress)
   * 2. Run OCR
   * 3. Populate date / category / amount fields
   * 4. Immediately auto-save that receipt to the gallery
   * 5. Move on — completely independent per receipt
   */
  const processFile = useCallback(
    async (itemId: string, file: File) => {
      // Step 1 — mark as processing
      setQueue((prev) =>
        prev.map((q) => (q.id === itemId ? { ...q, status: "processing" } : q)),
      );

      try {
        // Step 2 — process image (auto-crop, resize, compress)
        let processedDataUrl = await processImage(file);
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

        // Step 3 — OCR extraction (returns text + orientation from OCR.space)
        const { date: detectedDate, amount: detectedAmount, category: detectedCategory, orientation } =
          await extractOCRData(processedDataUrl);

        // Step 4 — If OCR detected a non-zero orientation, rotate the image to correct it
        if (orientation && orientation !== "0") {
          const deg = Number.parseInt(orientation) as 0 | 90 | 180 | 270;
          if (deg === 90 || deg === 180 || deg === 270) {
            processedDataUrl = await rotateImageByDegrees(processedDataUrl, deg);
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
          }
        }

        const anyDetected = detectedDate || detectedCategory || detectedAmount != null;

        // Step 5 — populate fields and mark OCR done
        setQueue((prev) =>
          prev.map((q) =>
            q.id === itemId
              ? {
                  ...q,
                  status: "done",
                  ocrAttempted: true,
                  ocrFailed: !anyDetected,
                  date: detectedDate ?? q.date,
                  category: detectedCategory ?? q.category,
                  amount:
                    detectedAmount != null ? String(detectedAmount) : q.amount,
                }
              : q,
          ),
        );

        // Step 6 — auto-save this receipt immediately after OCR fills it
        // (fire-and-forget so it doesn't block other receipts)
        saveOneReceipt(itemId);
      } catch {
        // OCR failed — still mark fields available for manual entry
        setQueue((prev) =>
          prev.map((q) =>
            q.id === itemId
              ? { ...q, status: "pending", ocrAttempted: true, ocrFailed: true }
              : q,
          ),
        );
        // Auto-save even on OCR failure so the image is captured
        saveOneReceipt(itemId);
      }
    },
    [saveOneReceipt],
  );

  // ─── File handling ──────────────────────────────────────────────────────────

  const enqueueFiles = useCallback(
    (files: File[]) => {
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
    [queue.length, processFile],
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

  // ─── Save all & go to gallery ───────────────────────────────────────────────

  async function handleSaveAndGo() {
    // Save any items that haven't been saved yet (OCR may have failed)
    const unsaved = queue.filter(
      (q) => !showSaved[q.id] && q.status !== "processing",
    );
    if (unsaved.length > 0) {
      await Promise.allSettled(unsaved.map((item) => saveOneReceipt(item.id)));
    }
    clearDraft();
    navigate({ to: "/gallery" });
  }

  const isProcessing = queue.some((q) => q.status === "processing");

  // ─── Empty / Upload Prompt ─────────────────────────────────────────────────

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

  // ─── Queue + Form view ──────────────────────────────────────────────────────

  return (
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
        {queue.length < MAX_QUEUE && (
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

      {/* Draft restored banner — auto-dismisses after 3 seconds */}
      <AnimatePresence>
        {draftBanner !== null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm"
            data-ocid="upload.draft_banner"
          >
            <span className="text-primary font-medium">
              {tLang("draftRestored", lang)} —{" "}
              {tLang("draftReceipts", lang).replace(
                "{count}",
                String(draftBanner),
              )}
            </span>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              onClick={() => {
                clearDraft();
                setQueue([]);
                setActiveIndex(0);
                setDraftBanner(null);
              }}
              data-ocid="upload.draft_discard_button"
            >
              {tLang("draftDiscard", lang)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing status summary */}
      {queue.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <span className="text-secondary font-medium">
            {Object.values(showSaved).filter(Boolean).length}/{queue.length}{" "}
            saved
          </span>
          {isProcessing && (
            <span className="flex items-center gap-1">
              <Loader2Icon size={11} className="animate-spin" /> Reading
              receipts…
            </span>
          )}
        </div>
      )}

      {/* Queue list */}
      <div className="space-y-2" data-ocid="upload.queue_list">
        <AnimatePresence>
          {queue.map((item, i) => (
            <QueueItemCard
              key={item.id}
              item={item}
              index={i}
              isActive={i === activeIndex}
              showSaved={!!showSaved[item.id]}
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
                <Loader2Icon size={28} className="text-primary animate-spin" />
                <p className="text-sm font-medium text-foreground">
                  {tLang("status.processing", lang)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Reading receipt with OCR…
                </p>
              </motion.div>
            )}

            {showSaved[activeItem.id] && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shadow-md"
              >
                <CheckCircle2Icon size={12} /> Saved
              </motion.div>
            )}

            {activeItem.imageDataUrl &&
              !activeItem.ocrFailed &&
              activeItem.ocrAttempted &&
              !showSaved[activeItem.id] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 text-foreground text-xs font-medium shadow"
                >
                  ✂️ Optimised
                </motion.div>
              )}

            {activeItem.ocrAttempted &&
              !activeItem.ocrFailed &&
              activeItem.status === "done" &&
              !showSaved[activeItem.id] && (
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
                  <span>Couldn't read receipt — fill in details manually</span>
                  <button
                    type="button"
                    className="flex-shrink-0"
                    onClick={() => processFile(activeItem.id, activeItem.file)}
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

            {/* Per-item manual save (visible for items OCR has finished but not yet saved) */}
            {activeItem.status !== "processing" &&
              !showSaved[activeItem.id] && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-secondary/40 text-secondary"
                  onClick={() => saveOneReceipt(activeItem.id)}
                  data-ocid="upload.save_one_button"
                >
                  <CheckCircle2Icon size={15} />
                  Save this receipt
                </Button>
              )}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="space-y-3 pb-6">
        <Button
          className="w-full gap-2"
          size="lg"
          onClick={handleSaveAndGo}
          disabled={isProcessing}
          data-ocid="upload.save_button"
        >
          {isProcessing ? (
            <>
              <Loader2Icon size={18} className="animate-spin" />
              Reading receipts…
            </>
          ) : (
            <>
              <CheckCircle2Icon size={18} />
              Save &amp; View Gallery
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => {
            clearDraft();
            navigate({ to: "/gallery" });
          }}
          data-ocid="upload.discard_button"
        >
          <Trash2Icon size={14} className="mr-1.5" />
          Discard all
        </Button>
      </div>
    </div>
  );
}

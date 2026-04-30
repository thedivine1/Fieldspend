import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { MONTH_KEYS, tLang } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import type { Category, DayGroup, Receipt } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GripVerticalIcon,
  InboxIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

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
  other: "📄",
};

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

// ─── Drag State ───────────────────────────────────────────────────────────────

interface DragState {
  receiptId: string;
  sourceDateStr: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const full = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (dateStr === todayStr) return `Today — ${full}`;
  if (dateStr === yesterdayStr) return `Yesterday — ${full}`;
  return full;
}

function buildDaySummary(
  receipts: Receipt[],
  lang: import("@/types").Language,
): string {
  const catCounts: Partial<Record<Category, number>> = {};
  for (const r of receipts) {
    catCounts[r.category] = (catCounts[r.category] ?? 0) + 1;
  }
  const parts = Object.entries(catCounts).map(
    ([cat, cnt]) => `${cnt} ${tLang(`cat.${cat}`, lang)}`,
  );
  const total = receipts.reduce((s, r) => s + (r.amount ?? 0), 0);
  return `${parts.join(", ")} — ${formatCurrency(total)} total`;
}

function groupByDay(
  receipts: Receipt[],
  month: number,
  year: number,
): DayGroup[] {
  const filtered = receipts.filter((r) => {
    const d = new Date(`${r.date}T12:00:00`);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const map = new Map<string, Receipt[]>();
  for (const r of filtered) {
    const arr = map.get(r.date) ?? [];
    arr.push(r);
    map.set(r.date, arr);
  }

  const groups: DayGroup[] = [];
  for (const [dateStr, items] of map.entries()) {
    items.sort((a, b) => b.createdAt - a.createdAt);
    const total = items.reduce((s, r) => s + (r.amount ?? 0), 0);
    groups.push({
      dateStr,
      label: formatDayLabel(dateStr),
      receipts: items,
      total,
    });
  }

  return groups.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
}

// ─── Month Selector ───────────────────────────────────────────────────────────

function MonthSelector() {
  const {
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    currentLanguage,
  } = useAppStore();

  const monthNames = MONTH_KEYS.map((key) => tLang(key, currentLanguage));

  function prev() {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  }

  function next() {
    const now = new Date();
    const isCurrentMonth =
      selectedMonth === now.getMonth() + 1 &&
      selectedYear === now.getFullYear();
    if (isCurrentMonth) return;
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  }

  const now = new Date();
  const isCurrentMonth =
    selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-20">
      <button
        type="button"
        onClick={prev}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        aria-label="Previous month"
        data-ocid="gallery.month_prev"
      >
        <ChevronLeftIcon size={18} className="text-foreground" />
      </button>

      <div className="text-center">
        <p className="font-display font-semibold text-foreground text-base">
          {monthNames[selectedMonth - 1]} {selectedYear}
        </p>
      </div>

      <button
        type="button"
        onClick={next}
        disabled={isCurrentMonth}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next month"
        data-ocid="gallery.month_next"
      >
        <ChevronRightIcon size={18} className="text-foreground" />
      </button>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  receipt: Receipt | null;
  onClose: () => void;
  onSave: (updated: Receipt) => Promise<void>;
}

function EditModal({ receipt, onClose, onSave }: EditModalProps) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const [date, setDate] = useState(receipt?.date ?? "");
  const [category, setCategory] = useState<Category>(
    receipt?.category ?? "other",
  );
  const [amount, setAmount] = useState(
    receipt?.amount != null ? String(receipt.amount) : "",
  );
  const [notes, setNotes] = useState(receipt?.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!receipt) return;
    setSaving(true);
    await onSave({
      ...receipt,
      date,
      category,
      amount: amount ? Number(amount) : undefined,
      notes: notes || undefined,
    });
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open={!!receipt} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-4" data-ocid="gallery.edit_dialog">
        <DialogHeader>
          <DialogTitle>{tLang("action.edit", lang)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
              data-ocid="gallery.edit_date_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as Category)}
            >
              <SelectTrigger
                id="edit-category"
                data-ocid="gallery.edit_category_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_ICONS[cat]} {tLang(`cat.${cat}`, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-amount">Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-ocid="gallery.edit_amount_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Add notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              data-ocid="gallery.edit_notes_textarea"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="gallery.edit_cancel_button"
          >
            {tLang("action.cancel", lang)}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !date}
            data-ocid="gallery.edit_save_button"
          >
            {saving
              ? tLang("settings.saving", lang)
              : tLang("action.save", lang)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteDialog({ open, onClose, onConfirm }: DeleteDialogProps) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
    onClose();
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent
        className="max-w-sm mx-4"
        data-ocid="gallery.delete_dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this receipt?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The receipt will be permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={onClose}
            data-ocid="gallery.delete_cancel_button"
          >
            {tLang("action.cancel", lang)}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="gallery.delete_confirm_button"
          >
            {deleting ? "…" : tLang("action.delete", lang)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Receipt Card ─────────────────────────────────────────────────────────────

interface ReceiptCardProps {
  receipt: Receipt;
  index: number;
  dayIndex: number;
  isDraggingThis: boolean;
  onEdit: (r: Receipt) => void;
  onDelete: (id: string) => void;
  onDragStart: (receiptId: string, sourceDateStr: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDropOnCard: (
    e: React.DragEvent,
    targetReceiptId: string,
    targetDateStr: string,
  ) => void;
}

function ReceiptCard({
  receipt,
  index,
  dayIndex,
  isDraggingThis,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDropOnCard,
}: ReceiptCardProps) {
  const { currentLanguage } = useAppStore();
  const catColor = CATEGORY_COLORS[receipt.category];
  const catIcon = CATEGORY_ICONS[receipt.category];

  // Long-press to initiate drag on mobile
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  function handlePointerDown() {
    longPressTimer.current = setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.draggable = true;
      }
    }, 400);
  }

  function handlePointerUp() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }

  function handleNativeDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", receipt.id);
    onDragStart(receipt.id, receipt.date);
  }

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleNativeDragStart}
      onDragOver={onDragOver}
      onDrop={(e) => onDropOnCard(e, receipt.id, receipt.date)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`receipt-card flex items-center gap-3 p-3 cursor-default select-none transition-opacity duration-150 ${
        isDraggingThis ? "opacity-40 scale-[0.98]" : "opacity-100"
      }`}
      data-ocid={`gallery.receipt.${dayIndex}.${index}`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="shrink-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-0.5"
        aria-label="Drag to reorder"
        data-ocid={`gallery.drag_handle.${dayIndex}.${index}`}
      >
        <GripVerticalIcon size={16} />
      </button>

      {/* Thumbnail */}
      {receipt.imageData ? (
        <img
          src={receipt.imageData}
          alt="receipt"
          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
        />
      ) : (
        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0 text-2xl">
          {catIcon}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${catColor}`}
          >
            {catIcon} {tLang(`cat.${receipt.category}`, currentLanguage)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {receipt.notes
            ? receipt.notes
            : new Date(`${receipt.date}T12:00:00`).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
        </p>
        {receipt.amount != null && (
          <p className="text-amount text-primary text-sm mt-0.5">
            {formatCurrency(receipt.amount)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(receipt)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Edit receipt"
          data-ocid={`gallery.edit_button.${dayIndex}.${index}`}
        >
          <PencilIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(receipt.id)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          aria-label="Delete receipt"
          data-ocid={`gallery.delete_button.${dayIndex}.${index}`}
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Day Drop Zone ────────────────────────────────────────────────────────────

interface DayDropZoneProps {
  dateStr: string;
  position: "top" | "bottom";
  isDragActive: boolean;
  isDragOver: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, targetDateStr: string) => void;
}

function DayDropZone({
  dateStr,
  position,
  isDragActive,
  isDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: DayDropZoneProps) {
  if (!isDragActive) return null;

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, dateStr)}
      className={`mx-4 rounded-lg border-2 border-dashed transition-all duration-150 ${
        position === "top" ? "mt-2 mb-1" : "mt-1 mb-2"
      } ${
        isDragOver
          ? "border-cyan-400 bg-cyan-400/10 h-10 flex items-center justify-center"
          : "border-border/50 h-2"
      }`}
      aria-hidden="true"
    >
      {isDragOver && (
        <span className="text-[11px] text-cyan-400 font-medium pointer-events-none">
          Drop here
        </span>
      )}
    </div>
  );
}

// ─── Day Group ────────────────────────────────────────────────────────────────

interface DayGroupCardProps {
  group: DayGroup;
  groupIndex: number;
  activeDrag: DragState | null;
  onEdit: (r: Receipt) => void;
  onDelete: (id: string) => void;
  onDragStart: (receiptId: string, sourceDateStr: string) => void;
  onDragEnd: () => void;
  onSameDayReorder: (dateStr: string, newOrder: Receipt[]) => void;
  onCrossDayDrop: (receiptId: string, targetDateStr: string) => void;
}

function DayGroupCard({
  group,
  groupIndex,
  activeDrag,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onSameDayReorder,
  onCrossDayDrop,
}: DayGroupCardProps) {
  const { currentLanguage } = useAppStore();

  // Drop zone hover states
  const [topZoneOver, setTopZoneOver] = useState(false);
  const [bottomZoneOver, setBottomZoneOver] = useState(false);
  const [headerOver, setHeaderOver] = useState(false);

  // Intersection Observer for lazy rendering
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isDragFromOtherDay =
    activeDrag !== null && activeDrag.sourceDateStr !== group.dateStr;
  const isDropTarget =
    isDragFromOtherDay && (topZoneOver || bottomZoneOver || headerOver);

  function handleHeaderDragOver(e: React.DragEvent) {
    if (!isDragFromOtherDay) return;
    e.preventDefault();
    setHeaderOver(true);
  }

  function handleHeaderDragLeave() {
    setHeaderOver(false);
  }

  function handleHeaderDrop(e: React.DragEvent) {
    e.preventDefault();
    setHeaderOver(false);
    if (activeDrag && isDragFromOtherDay) {
      onCrossDayDrop(activeDrag.receiptId, group.dateStr);
    }
    onDragEnd();
  }

  function handleZoneDrop(e: React.DragEvent, targetDateStr: string) {
    e.preventDefault();
    setTopZoneOver(false);
    setBottomZoneOver(false);
    if (activeDrag && isDragFromOtherDay) {
      onCrossDayDrop(activeDrag.receiptId, targetDateStr);
    }
    onDragEnd();
  }

  function handleCardDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDropOnCard(
    e: React.DragEvent,
    targetReceiptId: string,
    targetDateStr: string,
  ) {
    e.preventDefault();
    if (!activeDrag) return;

    if (activeDrag.sourceDateStr === group.dateStr) {
      // Same-day reorder
      const current = [...group.receipts];
      const fromIdx = current.findIndex((r) => r.id === activeDrag.receiptId);
      const toIdx = current.findIndex((r) => r.id === targetReceiptId);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        const [moved] = current.splice(fromIdx, 1);
        current.splice(toIdx, 0, moved);
        onSameDayReorder(group.dateStr, current);
      }
    } else {
      // Cross-day: move to this day
      onCrossDayDrop(activeDrag.receiptId, targetDateStr);
    }
    onDragEnd();
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: groupIndex * 0.05 }}
      data-ocid={`gallery.day_group.${groupIndex + 1}`}
      onDragEnd={onDragEnd}
    >
      {/* Top drop zone */}
      <DayDropZone
        dateStr={group.dateStr}
        position="top"
        isDragActive={isDragFromOtherDay}
        isDragOver={topZoneOver}
        onDragEnter={() => setTopZoneOver(true)}
        onDragLeave={() => setTopZoneOver(false)}
        onDrop={handleZoneDrop}
      />

      {/* Day header — also a drop target when dragging from another day */}
      <div
        className={`daily-header sticky top-[57px] z-10 backdrop-blur-sm transition-all duration-150 ${
          isDropTarget || headerOver
            ? "border-2 border-dashed border-cyan-400 bg-cyan-400/10 rounded-lg mx-2"
            : ""
        }`}
        onDragOver={handleHeaderDragOver}
        onDragLeave={handleHeaderDragLeave}
        onDrop={handleHeaderDrop}
        data-ocid={`gallery.day_header.${groupIndex + 1}`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {group.label}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {buildDaySummary(group.receipts, currentLanguage)}
          </p>
        </div>
        {group.total > 0 && (
          <span className="text-sm font-bold text-primary shrink-0 ml-3 font-mono">
            {formatCurrency(group.total)}
          </span>
        )}
        {/* "Move to [date]" indicator */}
        {headerOver && activeDrag && isDragFromOtherDay && (
          <span className="ml-2 text-[11px] text-cyan-400 font-semibold shrink-0 pointer-events-none">
            Move here
          </span>
        )}
      </div>

      {/* Cards — lazy rendered */}
      <div className="px-4 py-2 space-y-2">
        {isVisible
          ? group.receipts.map((receipt, ri) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                index={ri + 1}
                dayIndex={groupIndex + 1}
                isDraggingThis={activeDrag?.receiptId === receipt.id}
                onEdit={onEdit}
                onDelete={onDelete}
                onDragStart={onDragStart}
                onDragOver={handleCardDragOver}
                onDropOnCard={handleDropOnCard}
              />
            ))
          : // Placeholder while off-screen
            group.receipts.map((r, ri) => (
              <div
                key={`skeleton-${r.id}`}
                className="h-[88px] rounded-xl bg-muted/40 animate-pulse"
                style={{ animationDelay: `${ri * 50}ms` }}
              />
            ))}
      </div>

      {/* Bottom drop zone */}
      <DayDropZone
        dateStr={group.dateStr}
        position="bottom"
        isDragActive={isDragFromOtherDay}
        isDragOver={bottomZoneOver}
        onDragEnter={() => setBottomZoneOver(true)}
        onDragLeave={() => setBottomZoneOver(false)}
        onDrop={handleZoneDrop}
      />
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasMonthFilter }: { hasMonthFilter: boolean }) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center"
      data-ocid="gallery.empty_state"
    >
      <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-5 text-4xl">
        <InboxIcon size={40} className="text-primary" />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground mb-2">
        {hasMonthFilter
          ? tLang("report.no_receipts", lang)
          : tLang("status.no_receipts", lang)}
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        {hasMonthFilter
          ? tLang("report.no_receipts", lang)
          : tLang("onboard.step1.desc", lang)}
      </p>
      <Button asChild size="lg" data-ocid="gallery.upload_button">
        <Link to="/upload">
          <PlusCircleIcon size={18} className="mr-2" />
          {tLang("action.upload", lang)}
        </Link>
      </Button>
    </motion.div>
  );
}

// ─── Month Total Bar ──────────────────────────────────────────────────────────

function MonthTotalBar({
  groups,
  month,
  year,
}: {
  groups: DayGroup[];
  month: number;
  year: number;
}) {
  const { currentLanguage } = useAppStore();
  const monthNames = MONTH_KEYS.map((key) => tLang(key, currentLanguage));
  const grandTotal = groups.reduce((s, g) => s + g.total, 0);
  const receiptCount = groups.reduce((s, g) => s + g.receipts.length, 0);

  if (receiptCount === 0) return null;

  return (
    <div className="sticky bottom-0 z-20 bg-card border-t border-border px-4 py-3 flex items-center justify-between shadow-lg">
      <div>
        <p className="text-xs text-muted-foreground font-medium">
          {monthNames[month - 1]} {year} — {receiptCount}{" "}
          {tLang("report.receipts", currentLanguage)}
        </p>
        <p className="text-sm font-semibold text-foreground mt-0.5">
          {tLang("report.total", currentLanguage)}
        </p>
      </div>
      <span className="text-amount text-primary text-xl">
        {formatCurrency(grandTotal)}
      </span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const {
    receipts,
    selectedMonth,
    selectedYear,
    updateReceipt,
    deleteReceipt,
  } = useAppStore();

  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);

  useEffect(() => {
    setIsLoadingReceipts(false);
  }, []);

  // Global drag state — lifted from individual day groups
  const [activeDrag, setActiveDrag] = useState<DragState | null>(null);

  // Local reorder state per day (same-day reorder; cleared on cross-day move)
  const [dayOrders, setDayOrders] = useState<Map<string, Receipt[]>>(new Map());

  const groups = useMemo(() => {
    const base = groupByDay(receipts, selectedMonth, selectedYear);
    return base.map((g) => {
      const local = dayOrders.get(g.dateStr);
      if (local) {
        // Reconcile: only keep ids still present in g.receipts
        const validIds = new Set(g.receipts.map((r) => r.id));
        const reconciled = local.filter((r) => validIds.has(r.id));
        // Append any newly added receipts not yet in local order
        const inLocal = new Set(reconciled.map((r) => r.id));
        const extras = g.receipts.filter((r) => !inLocal.has(r.id));
        return { ...g, receipts: [...reconciled, ...extras] };
      }
      return g;
    });
  }, [receipts, selectedMonth, selectedYear, dayOrders]);

  const handleDragStart = useCallback(
    (receiptId: string, sourceDateStr: string) => {
      setActiveDrag({ receiptId, sourceDateStr });
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setActiveDrag(null);
  }, []);

  const handleSameDayReorder = useCallback(
    (dateStr: string, newOrder: Receipt[]) => {
      setDayOrders((prev) => new Map(prev).set(dateStr, newOrder));
    },
    [],
  );

  const handleCrossDayDrop = useCallback(
    async (receiptId: string, targetDateStr: string) => {
      const receipt = receipts.find((r) => r.id === receiptId);
      if (!receipt || receipt.date === targetDateStr) return;

      const updated: Receipt = { ...receipt, date: targetDateStr };

      // Optimistic: remove from source day's local order
      setDayOrders((prev) => {
        const next = new Map(prev);
        const sourceDateStr = receipt.date;
        const sourceOrder = next.get(sourceDateStr);
        if (sourceOrder) {
          next.set(
            sourceDateStr,
            sourceOrder.filter((r) => r.id !== receiptId),
          );
        }
        // Remove stale target order so it re-derives from store
        next.delete(targetDateStr);
        return next;
      });

      // Persist — updateReceipt updates the store and IndexedDB
      await updateReceipt(updated);
    },
    [receipts, updateReceipt],
  );

  const handleSaveEdit = useCallback(
    async (updated: Receipt) => {
      await updateReceipt(updated);
    },
    [updateReceipt],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingId) return;
    await deleteReceipt(deletingId);
    setDayOrders((prev) => {
      const next = new Map(prev);
      for (const [k, arr] of next.entries()) {
        next.set(
          k,
          arr.filter((r) => r.id !== deletingId),
        );
      }
      return next;
    });
  }, [deletingId, deleteReceipt]);

  return (
    <div
      className="flex flex-col min-h-full"
      data-ocid="gallery.page"
      // Clear drag state if user releases outside any drop zone
      onDragEnd={handleDragEnd}
    >
      {/* Month selector */}
      <MonthSelector />

      {isLoadingReceipts ? (
        <div className="p-4 space-y-4" data-ocid="gallery.loading_state">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState hasMonthFilter={receipts.length > 0} />
      ) : (
        <>
          <div className="flex-1 pb-2">
            {groups.map((group, gi) => (
              <DayGroupCard
                key={group.dateStr}
                group={group}
                groupIndex={gi}
                activeDrag={activeDrag}
                onEdit={setEditingReceipt}
                onDelete={setDeletingId}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onSameDayReorder={handleSameDayReorder}
                onCrossDayDrop={handleCrossDayDrop}
              />
            ))}
          </div>

          <MonthTotalBar
            groups={groups}
            month={selectedMonth}
            year={selectedYear}
          />
        </>
      )}

      {/* Edit modal */}
      <EditModal
        receipt={editingReceipt}
        onClose={() => setEditingReceipt(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete confirmation */}
      <DeleteDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

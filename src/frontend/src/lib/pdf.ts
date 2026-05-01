// ─── PDF Report Generation ────────────────────────────────────────────────────
// Uses jsPDF v4.x (default import). All errors are silent.

import type { CategoryTotal, Receipt, UserProfile } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CATEGORY_COLORS: Record<string, [number, number, number]> = {
  cab: [20, 148, 195],
  train: [34, 120, 80],
  bus: [130, 80, 200],
  localBus: [100, 60, 180],
  auto: [180, 120, 20],
  flight: [50, 120, 210],
  hotel: [200, 130, 20],
  meal: [200, 60, 60],
  other: [100, 100, 100],
};

// A4 dimensions in mm
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 10;
const HEADER_H = 18;

// Thumbnail grid: 3 per row
const THUMB_COLS = 3;
const THUMB_GAP = 4;
const THUMB_W = (CONTENT_W - THUMB_GAP * (THUMB_COLS - 1)) / THUMB_COLS; // ≈58.67mm
const THUMB_H = THUMB_W * 0.75; // 4:3 ≈44mm
const LABEL_H = 5; // mm below each thumb for amount label
const ROW_H = THUMB_H + LABEL_H + THUMB_GAP; // total height per thumbnail row

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Compress receipt image to max 150×150 JPEG at quality 0.4 for PDF thumbnail. */
async function compressToThumbnail(dataUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      if (!dataUrl || !dataUrl.startsWith("data:")) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const maxSize = 150;
          const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
          const w = Math.max(1, Math.round(img.width * ratio));
          const h = Math.max(1, Math.round(img.height * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.4));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    } catch {
      resolve(null);
    }
  });
}

function buildCategoryBreakdown(receipts: Receipt[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>();
  for (const r of receipts) {
    const ex = map.get(r.category);
    if (ex) {
      ex.total += r.amount ?? 0;
      ex.count += 1;
    } else {
      map.set(r.category, {
        category: r.category,
        total: r.amount ?? 0,
        count: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function groupByDate(receipts: Receipt[]): Map<string, Receipt[]> {
  const map = new Map<string, Receipt[]>();
  const sorted = [...receipts].sort((a, b) => a.date.localeCompare(b.date));
  for (const r of sorted) {
    const arr = map.get(r.date) ?? [];
    arr.push(r);
    map.set(r.date, arr);
  }
  return map;
}

// ─── jsPDF type alias ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = any;

// ─── Watermark ────────────────────────────────────────────────────────────────

function addWatermark(doc: Doc): void {
  try {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    // Save state via opacity GState
    doc.saveGraphicsState?.();
    doc.setGState(doc.GState({ opacity: 0.08 }));
    doc.setFontSize(40);
    doc.setTextColor(180, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("SAMPLE", w / 2, h / 2 - 16, { align: "center", angle: 45 });
    doc.text("FREE VERSION", w / 2, h / 2 + 16, { align: "center", angle: 45 });
    doc.restoreGraphicsState?.();
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setTextColor(30, 30, 30);
  } catch {
    // watermark is decorative — skip silently
  }
}

// ─── Mini header (subsequent pages) ──────────────────────────────────────────

function drawMiniHeader(doc: Doc, left: string, right: string): void {
  doc.setFillColor(12, 90, 110);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(left, MARGIN, 11.5);
  doc.text(right, PAGE_W - MARGIN, 11.5, { align: "right" });
  doc.setTextColor(30, 30, 30);
}

// ─── Cover page ───────────────────────────────────────────────────────────────

function drawCoverPage(
  doc: Doc,
  profile: UserProfile,
  receipts: Receipt[],
  month: number,
  year: number,
): void {
  const monthName = MONTH_NAMES[month - 1];
  const reportTitle = `Expense Report \u2014 ${monthName} ${year}`;
  const breakdown = buildCategoryBreakdown(receipts);
  const grandTotal = receipts.reduce((s, r) => s + (r.amount ?? 0), 0);

  // ── Header band ────────────────────────────────────────────────────────────
  doc.setFillColor(12, 90, 110);
  doc.rect(0, 0, PAGE_W, 42, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Fieldspend", MARGIN, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(reportTitle, MARGIN, 29);
  if (profile.companyName)
    doc.text(profile.companyName, PAGE_W - MARGIN, 18, { align: "right" });
  doc.text(profile.name || "—", PAGE_W - MARGIN, 29, { align: "right" });

  doc.setTextColor(30, 30, 30);

  // ── Prepared date ──────────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Prepared: ${new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`,
    MARGIN,
    51,
  );

  // ── Grand total box (use rect, NOT roundedRect) ────────────────────────────
  doc.setFillColor(240, 252, 250);
  doc.rect(MARGIN, 57, CONTENT_W, 22, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("Grand Total", MARGIN + 7, 68);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(12, 90, 110);
  doc.text(formatCurrency(grandTotal), PAGE_W - MARGIN - 7, 68, {
    align: "right",
  });

  // Receipt count
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Receipts: ${receipts.length}`, MARGIN + 7, 75);

  // ── Category breakdown table ───────────────────────────────────────────────
  let y = 91;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Category Breakdown", MARGIN, y);
  y += 8;

  // Table header
  doc.setFillColor(12, 90, 110);
  doc.rect(MARGIN, y, CONTENT_W, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Category", MARGIN + 5, y + 5.5);
  doc.text("Count", PAGE_W / 2, y + 5.5, { align: "center" });
  doc.text("Amount", PAGE_W - MARGIN - 5, y + 5.5, { align: "right" });
  y += 8;

  breakdown.forEach((item, i) => {
    const rowColor: [number, number, number] =
      i % 2 === 0 ? [248, 252, 251] : [255, 255, 255];
    doc.setFillColor(...rowColor);
    doc.rect(MARGIN, y, CONTENT_W, 8, "F");
    const catColor = CATEGORY_COLORS[item.category] ?? [100, 100, 100];
    doc.setFillColor(...(catColor as [number, number, number]));
    doc.rect(MARGIN, y, 3, 8, "F");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const label =
      item.category.charAt(0).toUpperCase() + item.category.slice(1);
    doc.text(label, MARGIN + 7, y + 5.5);
    doc.text(String(item.count), PAGE_W / 2, y + 5.5, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(item.total), PAGE_W - MARGIN - 5, y + 5.5, {
      align: "right",
    });
    y += 8;
  });

  // Grand total row
  doc.setFillColor(12, 90, 110);
  doc.rect(MARGIN, y, CONTENT_W, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", MARGIN + 7, y + 6);
  doc.text(formatCurrency(grandTotal), PAGE_W - MARGIN - 5, y + 6, {
    align: "right",
  });
}

// ─── Thumbnail placement helper ───────────────────────────────────────────────

function placeThumbnail(
  doc: Doc,
  thumb: string | null,
  rcp: Receipt,
  xPos: number,
  yPos: number,
): void {
  if (thumb) {
    try {
      // Strip data URL prefix — pass raw base64 to addImage
      const base64 = thumb.includes(",") ? thumb.split(",")[1] : thumb;
      doc.addImage(
        base64,
        "JPEG",
        xPos,
        yPos,
        THUMB_W,
        THUMB_H,
        undefined,
        "FAST",
      );
    } catch {
      // fallback: grey placeholder
      doc.setFillColor(220, 220, 220);
      doc.rect(xPos, yPos, THUMB_W, THUMB_H, "F");
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("No image", xPos + THUMB_W / 2, yPos + THUMB_H / 2, {
        align: "center",
      });
    }
  } else {
    doc.setFillColor(220, 220, 220);
    doc.rect(xPos, yPos, THUMB_W, THUMB_H, "F");
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("No image", xPos + THUMB_W / 2, yPos + THUMB_H / 2, {
      align: "center",
    });
  }

  // Amount label below thumb
  if (rcp.amount) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(12, 90, 110);
    doc.text(
      formatCurrency(rcp.amount),
      xPos + THUMB_W / 2,
      yPos + THUMB_H + 3.5,
      { align: "center" },
    );
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateExpenseReport(
  profile: UserProfile,
  receipts: Receipt[],
  month: number,
  year: number,
  isFreeUser: boolean,
): Promise<Blob> {
  // Default import — avoids named-import failures in some bundler configs
  const jspdfModule = await import("jspdf");
  const jsPDF = jspdfModule.jsPDF || jspdfModule.default;

  const doc: Doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // ── Page 1: Cover ────────────────────────────────────────────────────────────
  drawCoverPage(doc, profile, receipts, month, year);
  if (isFreeUser) addWatermark(doc);

  // ── Compress all thumbnails up front (Promise.allSettled — never throws) ────
  const thumbResults = await Promise.allSettled(
    receipts.map((r) =>
      r.imageData ? compressToThumbnail(r.imageData) : Promise.resolve(null),
    ),
  );
  const thumbMap = new Map<string, string | null>();
  receipts.forEach((r, i) => {
    const result = thumbResults[i];
    thumbMap.set(r.id, result.status === "fulfilled" ? result.value : null);
  });

  // ── Daily sections ───────────────────────────────────────────────────────────
  const dayGroups = groupByDate(receipts);
  const USABLE_H = PAGE_H - FOOTER_H - 2; // leave 2mm breathing room above footer
  const DAY_HDR_H = 12; // height of the day section header band

  // Helper: ensure there's enough vertical space; if not, add a new page
  function ensureSpace(needed: number, currentY: number): number {
    if (currentY + needed > USABLE_H) {
      doc.addPage();
      drawMiniHeader(
        doc,
        "Fieldspend \u2014 Daily Receipts",
        `${MONTH_NAMES[month - 1]} ${year}`,
      );
      if (isFreeUser) addWatermark(doc);
      return HEADER_H + 4;
    }
    return currentY;
  }

  // Start daily sections on a fresh page after the cover
  doc.addPage();
  drawMiniHeader(
    doc,
    "Fieldspend \u2014 Daily Receipts",
    `${MONTH_NAMES[month - 1]} ${year}`,
  );
  if (isFreeUser) addWatermark(doc);
  let currentY = HEADER_H + 4;

  for (const [dateStr, dayReceipts] of dayGroups) {
    const dayTotal = dayReceipts.reduce((s, r) => s + (r.amount ?? 0), 0);
    const dateLabel = formatDateLabel(dateStr);

    // Ensure there's room for at least the day header + one thumbnail row
    currentY = ensureSpace(DAY_HDR_H + ROW_H, currentY);

    // ── Day section header ──────────────────────────────────────────────────
    doc.setFillColor(230, 245, 242);
    doc.rect(MARGIN, currentY, CONTENT_W, DAY_HDR_H, "F");
    doc.setFillColor(12, 90, 110);
    doc.rect(MARGIN, currentY, 3, DAY_HDR_H, "F");
    doc.setTextColor(12, 90, 110);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(dateLabel, MARGIN + 6, currentY + 8);
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${dayReceipts.length} receipt${dayReceipts.length !== 1 ? "s" : ""}`,
      PAGE_W / 2,
      currentY + 8,
      { align: "center" },
    );
    doc.setFont("helvetica", "bold");
    doc.setTextColor(12, 90, 110);
    doc.text(formatCurrency(dayTotal), PAGE_W - MARGIN - 4, currentY + 8, {
      align: "right",
    });
    currentY += DAY_HDR_H + 3;

    // ── Thumbnail grid ──────────────────────────────────────────────────────
    for (let i = 0; i < dayReceipts.length; i++) {
      const col = i % THUMB_COLS;

      // Start a new row — check if a full row fits; if not, get a new page
      if (col === 0) {
        currentY = ensureSpace(ROW_H, currentY);
      }

      const xPos = MARGIN + col * (THUMB_W + THUMB_GAP);
      const yPos = currentY;

      placeThumbnail(
        doc,
        thumbMap.get(dayReceipts[i].id) ?? null,
        dayReceipts[i],
        xPos,
        yPos,
      );

      // After placing the last column in a row, advance Y
      if (col === THUMB_COLS - 1 || i === dayReceipts.length - 1) {
        currentY += ROW_H;
      }
    }

    currentY += THUMB_GAP; // breathing space between day sections
  }

  // ── Footer on every page ─────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(240, 245, 245);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Fieldspend \u2014 Generated ${new Date().toLocaleDateString("en-IN")}`,
      MARGIN,
      PAGE_H - 3.5,
    );
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 3.5, {
      align: "right",
    });
  }

  // ── Return blob ───────────────────────────────────────────────────────────────
  return doc.output("blob") as Blob;
}

// Re-export compressToThumbnail for use in other modules if needed
export { compressToThumbnail };

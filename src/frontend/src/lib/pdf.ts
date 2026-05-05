// ─── PDF Report Generation ────────────────────────────────────────────────────
// Uses jsPDF v4.x. Full-width portrait receipt images.

import type { CategoryTotal, Receipt, UserProfile } from "@/types";
import { jsPDF } from "jspdf";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CATEGORY_COLORS: Record<string, [number, number, number]> = {
  cab: [20, 148, 195], train: [34, 120, 80], bus: [130, 80, 200],
  localBus: [100, 60, 180], auto: [180, 120, 20], flight: [50, 120, 210],
  hotel: [200, 130, 20], meal: [200, 60, 60], other: [100, 100, 100],
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 10;
const HEADER_H = 18;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  } catch { return dateStr; }
}

/** Compress image for PDF — keeps up to 1200px, JPEG quality 0.65. Returns data + dimensions. */
async function compressForPdf(dataUrl: string): Promise<{ data: string; w: number; h: number } | null> {
  return new Promise((resolve) => {
    try {
      if (!dataUrl || !dataUrl.startsWith("data:")) { resolve(null); return; }
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1200;
          const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
          const w = Math.max(1, Math.round(img.width * ratio));
          const h = Math.max(1, Math.round(img.height * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { resolve(null); return; }
          ctx.drawImage(img, 0, 0, w, h);
          resolve({ data: canvas.toDataURL("image/jpeg", 0.65), w, h });
        } catch { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    } catch { resolve(null); }
  });
}

/** Compress receipt image to max 150×150 JPEG at quality 0.4 for thumbnail. */
async function compressToThumbnail(dataUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      if (!dataUrl || !dataUrl.startsWith("data:")) { resolve(null); return; }
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
          if (!ctx) { resolve(null); return; }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.4));
        } catch { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    } catch { resolve(null); }
  });
}

function buildCategoryBreakdown(receipts: Receipt[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>();
  for (const r of receipts) {
    const ex = map.get(r.category);
    if (ex) { ex.total += r.amount ?? 0; ex.count += 1; }
    else { map.set(r.category, { category: r.category, total: r.amount ?? 0, count: 1 }); }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = any;

// ─── Watermark ────────────────────────────────────────────────────────────────

function addWatermark(doc: Doc): void {
  try {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
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
  } catch { /* watermark is decorative */ }
}

// ─── Mini header ──────────────────────────────────────────────────────────────

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

function drawCoverPage(doc: Doc, profile: UserProfile, receipts: Receipt[], month: number, year: number): void {
  const monthName = MONTH_NAMES[month - 1];
  const reportTitle = `Expense Report \u2014 ${monthName} ${year}`;
  const breakdown = buildCategoryBreakdown(receipts);
  const grandTotal = receipts.reduce((s, r) => s + (r.amount ?? 0), 0);

  doc.setFillColor(12, 90, 110);
  doc.rect(0, 0, PAGE_W, 42, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Fieldspend", MARGIN, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(reportTitle, MARGIN, 29);
  if (profile.companyName) doc.text(profile.companyName, PAGE_W - MARGIN, 18, { align: "right" });
  doc.text(profile.name || "\u2014", PAGE_W - MARGIN, 29, { align: "right" });
  doc.setTextColor(30, 30, 30);

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(`Prepared: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, MARGIN, 51);

  doc.setFillColor(240, 252, 250);
  doc.rect(MARGIN, 57, CONTENT_W, 22, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("Grand Total", MARGIN + 7, 68);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(12, 90, 110);
  doc.text(formatCurrency(grandTotal), PAGE_W - MARGIN - 7, 68, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Receipts: ${receipts.length}`, MARGIN + 7, 75);

  let y = 91;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Category Breakdown", MARGIN, y);
  y += 8;

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
    const rowColor: [number, number, number] = i % 2 === 0 ? [248, 252, 251] : [255, 255, 255];
    doc.setFillColor(...rowColor);
    doc.rect(MARGIN, y, CONTENT_W, 8, "F");
    const catColor = CATEGORY_COLORS[item.category] ?? [100, 100, 100];
    doc.setFillColor(...(catColor as [number, number, number]));
    doc.rect(MARGIN, y, 3, 8, "F");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(item.category.charAt(0).toUpperCase() + item.category.slice(1), MARGIN + 7, y + 5.5);
    doc.text(String(item.count), PAGE_W / 2, y + 5.5, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(item.total), PAGE_W - MARGIN - 5, y + 5.5, { align: "right" });
    y += 8;
  });

  doc.setFillColor(12, 90, 110);
  doc.rect(MARGIN, y, CONTENT_W, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", MARGIN + 7, y + 6);
  doc.text(formatCurrency(grandTotal), PAGE_W - MARGIN - 5, y + 6, { align: "right" });
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateExpenseReport(
  profile: UserProfile,
  receipts: Receipt[],
  month: number,
  year: number,
  isFreeUser: boolean,
): Promise<Blob> {
  const doc: Doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Page 1: Cover
  drawCoverPage(doc, profile, receipts, month, year);
  if (isFreeUser) addWatermark(doc);

  // Compress all images at print quality
  const imgResults = await Promise.allSettled(
    receipts.map((r) => r.imageData ? compressForPdf(r.imageData) : Promise.resolve(null)),
  );
  const imgMap = new Map<string, { data: string; w: number; h: number } | null>();
  receipts.forEach((r, i) => {
    const result = imgResults[i];
    imgMap.set(r.id, result.status === "fulfilled" ? result.value : null);
  });

  // Receipt image pages — full-width portrait images
  const dayGroups = groupByDate(receipts);
  const USABLE_H = PAGE_H - FOOTER_H - 2;
  const CAP_H = 10;
  const GAP = 6;

  function newPage(): number {
    doc.addPage();
    drawMiniHeader(doc, "Fieldspend \u2014 Receipts", `${MONTH_NAMES[month - 1]} ${year}`);
    if (isFreeUser) addWatermark(doc);
    return HEADER_H + 4;
  }

  let curY = newPage();

  for (const [dateStr, dayReceipts] of dayGroups) {
    const dayTotal = dayReceipts.reduce((s, r) => s + (r.amount ?? 0), 0);

    // Day header
    if (curY + 16 > USABLE_H) curY = newPage();
    doc.setFillColor(230, 245, 242);
    doc.rect(MARGIN, curY, CONTENT_W, 12, "F");
    doc.setFillColor(12, 90, 110);
    doc.rect(MARGIN, curY, 3, 12, "F");
    doc.setTextColor(12, 90, 110);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(formatDateLabel(dateStr), MARGIN + 6, curY + 8);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(dayTotal), PAGE_W - MARGIN - 4, curY + 8, { align: "right" });
    curY += 15;

    // Each receipt image — full width
    for (const rcp of dayReceipts) {
      const imgInfo = imgMap.get(rcp.id) ?? null;

      if (imgInfo) {
        // Scale to fill content width
        const scale = CONTENT_W / imgInfo.w;
        let imgW = CONTENT_W;
        let imgH = imgInfo.h * scale;

        // Cap to max page height
        const maxH = USABLE_H - HEADER_H - CAP_H - GAP - 8;
        if (imgH > maxH) {
          const fit = maxH / imgH;
          imgW *= fit;
          imgH = maxH;
        }

        const needed = CAP_H + imgH + GAP;
        if (curY + needed > USABLE_H) curY = newPage();

        // Caption bar
        doc.setFillColor(240, 248, 246);
        doc.rect(MARGIN, curY, CONTENT_W, CAP_H, "F");
        doc.setFillColor(12, 90, 110);
        doc.rect(MARGIN, curY, 2.5, CAP_H, "F");
        const catLabel = rcp.category.charAt(0).toUpperCase() + rcp.category.slice(1);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(12, 90, 110);
        doc.text(catLabel, MARGIN + 5, curY + 6.5);
        if (rcp.amount) {
          doc.text(formatCurrency(rcp.amount), PAGE_W - MARGIN - 4, curY + 6.5, { align: "right" });
        }
        curY += CAP_H;

        // Image — centered
        const xOff = MARGIN + (CONTENT_W - imgW) / 2;
        try {
          const b64 = imgInfo.data.includes(",") ? imgInfo.data.split(",")[1] : imgInfo.data;
          doc.addImage(b64, "JPEG", xOff, curY, imgW, imgH, undefined, "FAST");
        } catch {
          doc.setFillColor(230, 230, 230);
          doc.rect(xOff, curY, imgW, imgH, "F");
        }
        curY += imgH + GAP;
      } else {
        // No image placeholder
        if (curY + CAP_H + 4 > USABLE_H) curY = newPage();
        doc.setFillColor(240, 248, 246);
        doc.rect(MARGIN, curY, CONTENT_W, CAP_H, "F");
        doc.setFillColor(12, 90, 110);
        doc.rect(MARGIN, curY, 2.5, CAP_H, "F");
        const catLabel = rcp.category.charAt(0).toUpperCase() + rcp.category.slice(1);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(12, 90, 110);
        doc.text(`${catLabel} \u2014 No image`, MARGIN + 5, curY + 6.5);
        if (rcp.amount) {
          doc.text(formatCurrency(rcp.amount), PAGE_W - MARGIN - 4, curY + 6.5, { align: "right" });
        }
        curY += CAP_H + 4;
      }
    }
    curY += 4;
  }

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(240, 245, 245);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`Fieldspend \u2014 Generated ${new Date().toLocaleDateString("en-IN")}`, MARGIN, PAGE_H - 3.5);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 3.5, { align: "right" });
  }

  return doc.output("blob") as Blob;
}

export { compressToThumbnail };

import { t } from "@/lib/i18n";
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

// A4 in mm
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 10;
const CONTENT_W = PAGE_W - MARGIN * 2;

// Thumbnail grid: 3 per row, ~60mm wide, ~45mm tall, 5mm gap
const THUMB_COLS = 3;
const THUMB_GAP = 5;
const THUMB_W = (CONTENT_W - THUMB_GAP * (THUMB_COLS - 1)) / THUMB_COLS; // ~56.67mm
const THUMB_H = THUMB_W * 0.75; // 4:3 ratio ≈ 42.5mm

const FOOTER_H = 10;
const HEADER_H = 18;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Compress a data URL to max 200px wide JPEG at quality 0.5 for thumbnail use. */
async function compressToThumbnail(dataUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, 200 / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.5));
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
    } else
      map.set(r.category, {
        category: r.category,
        total: r.amount ?? 0,
        count: 1,
      });
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

// ─── Watermark ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addWatermark(doc: any): void {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setGState(doc.GState({ opacity: 0.1 }));
  doc.setFontSize(44);
  doc.setTextColor(180, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("SAMPLE", w / 2, h / 2 - 18, { align: "center", angle: 45 });
  doc.text("FREE VERSION", w / 2, h / 2 + 18, { align: "center", angle: 45 });
  doc.setGState(doc.GState({ opacity: 1 }));
  doc.setTextColor(0, 0, 0);
}

// ─── Page primitives ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawMiniHeader(doc: any, left: string, right: string): void {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawCoverPage(
  doc: any,
  profile: UserProfile,
  receipts: Receipt[],
  month: number,
  year: number,
): void {
  const monthName = MONTH_NAMES[month - 1];
  const reportTitle = `${t("report.title")} — ${monthName} ${year}`;
  const breakdown = buildCategoryBreakdown(receipts);
  const grandTotal = receipts.reduce((s, r) => s + (r.amount ?? 0), 0);

  // Header band
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
  doc.text(profile.name, PAGE_W - MARGIN, 29, { align: "right" });

  doc.setTextColor(30, 30, 30);

  // Prepared date
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Prepared: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
    MARGIN,
    51,
  );

  // Grand total box
  doc.setFillColor(240, 252, 250);
  doc.roundedRect(MARGIN, 57, CONTENT_W, 22, 3, 3, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(t("report.total"), MARGIN + 7, 68);
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
  doc.text(`Total ${t("report.receipts")}: ${receipts.length}`, MARGIN + 7, 75);

  // Category breakdown table
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

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateExpenseReport(
  profile: UserProfile,
  receipts: Receipt[],
  month: number,
  year: number,
  isFreeUser: boolean,
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // ── Page 1: Cover ───────────────────────────────────────────────────────────
  drawCoverPage(doc, profile, receipts, month, year);
  if (isFreeUser) addWatermark(doc);

  // ── Compress all receipt images up front ───────────────────────────────────
  // Map receipt id → compressed thumbnail (null = skip)
  const thumbMap = new Map<string, string | null>();
  await Promise.all(
    receipts.map(async (r) => {
      if (!r.imageData) {
        thumbMap.set(r.id, null);
        return;
      }
      const thumb = await compressToThumbnail(r.imageData);
      thumbMap.set(r.id, thumb);
    }),
  );

  // ── Daily sections ─────────────────────────────────────────────────────────
  const dayGroups = groupByDate(receipts);
  const USABLE_H = PAGE_H - FOOTER_H; // exclude footer zone

  // Track current y on the current page (start after cover → new page per day)
  let currentY = PAGE_H; // force first day to start on a new page

  for (const [dateStr, dayReceipts] of dayGroups) {
    const dayTotal = dayReceipts.reduce((s, r) => s + (r.amount ?? 0), 0);
    const dateLabel = formatDateLabel(dateStr);

    // Day section header height: 12mm
    const DAY_HEADER_H = 12;
    // Row height = THUMB_H + 4mm label below each thumb + 2mm row gap
    const ROW_H = THUMB_H + 6;
    const rows = Math.ceil(dayReceipts.length / THUMB_COLS);
    const sectionH = DAY_HEADER_H + rows * ROW_H + THUMB_GAP;

    // If the section doesn't fit, start a new page
    // (also always start a new page if we're on the cover)
    if (currentY + sectionH > USABLE_H) {
      doc.addPage();
      drawMiniHeader(
        doc,
        "Fieldspend — Daily Receipts",
        `${MONTH_NAMES[month - 1]} ${year}`,
      );
      if (isFreeUser) addWatermark(doc);
      currentY = HEADER_H + 4;
    }

    // ── Day section header ────────────────────────────────────────────────────
    doc.setFillColor(230, 245, 242);
    doc.roundedRect(MARGIN, currentY, CONTENT_W, DAY_HEADER_H, 2, 2, "F");
    doc.setFillColor(12, 90, 110);
    doc.rect(MARGIN, currentY, 3, DAY_HEADER_H, "F");
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
    currentY += DAY_HEADER_H + 3;

    // ── Thumbnail grid ────────────────────────────────────────────────────────
    for (let i = 0; i < dayReceipts.length; i++) {
      const col = i % THUMB_COLS;
      const row = Math.floor(i / THUMB_COLS);

      // Start a new page mid-section if we've run out of space
      if (col === 0 && i > 0) {
        const usedY = currentY + row * ROW_H;
        if (usedY + ROW_H > USABLE_H) {
          doc.addPage();
          drawMiniHeader(
            doc,
            `${dateLabel} (cont.)`,
            `${MONTH_NAMES[month - 1]} ${year}`,
          );
          if (isFreeUser) addWatermark(doc);
          currentY = HEADER_H + 4;
          // Reset row offset — we'll recalculate from the new page
          // We need to re-draw remaining receipts from this row
          // Re-slice: restart grid from current i
          const remaining = dayReceipts.slice(i);
          // Recurse the remaining as a mini-grid starting at currentY
          for (let j = 0; j < remaining.length; j++) {
            const c = j % THUMB_COLS;
            const r2 = Math.floor(j / THUMB_COLS);
            if (c === 0 && j > 0 && currentY + (r2 + 1) * ROW_H > USABLE_H) {
              doc.addPage();
              drawMiniHeader(
                doc,
                `${dateLabel} (cont.)`,
                `${MONTH_NAMES[month - 1]} ${year}`,
              );
              if (isFreeUser) addWatermark(doc);
              currentY = HEADER_H + 4;
            }
            const xPos = MARGIN + c * (THUMB_W + THUMB_GAP);
            const yPos = currentY + Math.floor(j / THUMB_COLS) * ROW_H;
            const rcp = remaining[j];
            const thumb = thumbMap.get(rcp.id);
            if (thumb) {
              try {
                doc.addImage(
                  thumb,
                  "JPEG",
                  xPos,
                  yPos,
                  THUMB_W,
                  THUMB_H,
                  undefined,
                  "FAST",
                );
              } catch {
                /* skip */
              }
            } else {
              doc.setFillColor(230, 230, 230);
              doc.rect(xPos, yPos, THUMB_W, THUMB_H, "F");
              doc.setTextColor(160, 160, 160);
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
                yPos + THUMB_H + 4,
                { align: "center" },
              );
            }
          }
          const finalRows = Math.ceil(remaining.length / THUMB_COLS);
          currentY += finalRows * ROW_H + THUMB_GAP;
          break; // skip original loop continuation for this day — already handled
        }
      }

      const xPos = MARGIN + col * (THUMB_W + THUMB_GAP);
      const yPos = currentY + row * ROW_H;
      const rcp = dayReceipts[i];
      const thumb = thumbMap.get(rcp.id);

      if (thumb) {
        try {
          doc.addImage(
            thumb,
            "JPEG",
            xPos,
            yPos,
            THUMB_W,
            THUMB_H,
            undefined,
            "FAST",
          );
        } catch {
          /* skip */
        }
      } else {
        doc.setFillColor(230, 230, 230);
        doc.rect(xPos, yPos, THUMB_W, THUMB_H, "F");
        doc.setTextColor(160, 160, 160);
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
          yPos + THUMB_H + 4,
          { align: "center" },
        );
      }
    }

    // Advance y past the last row (only if we didn't break early above)
    const lastRow = Math.ceil(dayReceipts.length / THUMB_COLS);
    // Check we haven't already advanced currentY in the break above
    // (If break happened, currentY was already updated)
    // Safe: add the section height only if currentY hasn't moved beyond this section
    const expectedBottom = currentY + lastRow * ROW_H + THUMB_GAP;
    if (expectedBottom > currentY) {
      currentY = expectedBottom;
    }
  }

  // ── Footer on all pages ────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(240, 245, 245);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Fieldspend — Generated ${new Date().toLocaleDateString("en-IN")}`,
      MARGIN,
      PAGE_H - 3.5,
    );
    doc.text(`Page ${i} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 3.5, {
      align: "right",
    });
  }

  return doc.output("blob");
}

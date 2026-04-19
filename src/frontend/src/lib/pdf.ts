import { t } from "@/lib/i18n";
import type { CategoryTotal, Receipt, UserProfile } from "@/types";

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
  flight: [50, 120, 210],
  hotel: [200, 130, 20],
  meal: [200, 60, 60],
  other: [100, 100, 100],
};

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addWatermark(doc: any): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setGState(doc.GState({ opacity: 0.12 }));
  doc.setFontSize(48);
  doc.setTextColor(180, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("SAMPLE", pageWidth / 2, pageHeight / 2 - 20, {
    align: "center",
    angle: 45,
  });
  doc.text("FREE VERSION", pageWidth / 2, pageHeight / 2 + 20, {
    align: "center",
    angle: 45,
  });
  doc.setGState(doc.GState({ opacity: 1 }));
  doc.setTextColor(0, 0, 0);
}

function buildCategoryBreakdown(receipts: Receipt[]): CategoryTotal[] {
  const map = new Map<string, CategoryTotal>();
  for (const r of receipts) {
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
}

export async function generateExpenseReport(
  profile: UserProfile,
  receipts: Receipt[],
  month: number,
  year: number,
  isFreeUser: boolean,
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const monthName = MONTH_NAMES[month - 1];
  const reportTitle = `${t("report.title")} — ${monthName} ${year}`;
  const breakdown = buildCategoryBreakdown(receipts);
  const grandTotal = receipts.reduce((sum, r) => sum + (r.amount ?? 0), 0);

  // ── Page 1: Summary ────────────────────────────────────────────────────────

  // Header band
  doc.setFillColor(12, 90, 110);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SalesExpense Pro", 15, 18);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(reportTitle, 15, 28);

  if (profile.companyName) {
    doc.text(profile.companyName, pageWidth - 15, 18, { align: "right" });
  }
  doc.text(profile.name, pageWidth - 15, 28, { align: "right" });

  // Reset text color
  doc.setTextColor(30, 30, 30);

  // Prepared date
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Prepared: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
    15,
    50,
  );

  // Grand total box
  doc.setFillColor(240, 252, 250);
  doc.roundedRect(15, 56, pageWidth - 30, 22, 3, 3, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(t("report.total"), 22, 67);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(12, 90, 110);
  doc.text(formatCurrency(grandTotal), pageWidth - 22, 67, { align: "right" });

  // Receipts count
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Total ${t("report.receipts")}: ${receipts.length}`, 22, 74);

  // Category breakdown table
  let y = 90;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Category Breakdown", 15, y);
  y += 8;

  // Table header
  doc.setFillColor(12, 90, 110);
  doc.rect(15, y, pageWidth - 30, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Category", 20, y + 5.5);
  doc.text("Count", pageWidth / 2, y + 5.5, { align: "center" });
  doc.text("Amount", pageWidth - 20, y + 5.5, { align: "right" });
  y += 8;

  // Table rows
  breakdown.forEach((item, i) => {
    const rowColor = i % 2 === 0 ? [248, 252, 251] : [255, 255, 255];
    doc.setFillColor(...(rowColor as [number, number, number]));
    doc.rect(15, y, pageWidth - 30, 8, "F");

    const catColor = CATEGORY_COLORS[item.category] ?? [100, 100, 100];
    doc.setFillColor(...(catColor as [number, number, number]));
    doc.rect(15, y, 3, 8, "F");

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const catLabel =
      item.category.charAt(0).toUpperCase() + item.category.slice(1);
    doc.text(catLabel, 22, y + 5.5);
    doc.text(String(item.count), pageWidth / 2, y + 5.5, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(item.total), pageWidth - 20, y + 5.5, {
      align: "right",
    });
    y += 8;
  });

  // Total row
  doc.setFillColor(12, 90, 110);
  doc.rect(15, y, pageWidth - 30, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", 22, y + 6);
  doc.text(formatCurrency(grandTotal), pageWidth - 20, y + 6, {
    align: "right",
  });

  if (isFreeUser) addWatermark(doc);

  // ── Page 2+: Receipt Images ────────────────────────────────────────────────

  for (const receipt of receipts) {
    if (!receipt.imageData) continue;
    doc.addPage();

    // Mini header
    doc.setFillColor(12, 90, 110);
    doc.rect(0, 0, pageWidth, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Receipt — ${receipt.date}`, 15, 12);
    const catLabel =
      receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1);
    doc.text(catLabel, pageWidth - 15, 12, { align: "right" });

    // Image
    const imgMaxW = pageWidth - 20;
    const imgMaxH = 200;
    try {
      doc.addImage(
        receipt.imageData,
        "JPEG",
        10,
        22,
        imgMaxW,
        imgMaxH,
        undefined,
        "FAST",
      );
    } catch {
      // skip non-renderable images
    }

    // Notes & amount
    if (receipt.amount) {
      doc.setTextColor(12, 90, 110);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(receipt.amount), pageWidth - 15, 228, {
        align: "right",
      });
    }
    if (receipt.notes) {
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(receipt.notes, 15, 235, {
        maxWidth: pageWidth - 30,
      });
    }

    if (isFreeUser) addWatermark(doc);
  }

  // ── Footer on all pages ────────────────────────────────────────────────────

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(240, 245, 245);
    doc.rect(0, pageH - 10, pageWidth, 10, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `SalesExpense Pro — Generated ${new Date().toLocaleDateString("en-IN")}`,
      15,
      pageH - 3.5,
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, pageH - 3.5, {
      align: "right",
    });
  }

  return doc.output("blob");
}

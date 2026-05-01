const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-_j9THATd.js","assets/index-NKFMDfSM.js","assets/index-D0HYbBVU.css"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, _ as __vitePreload, a as useAppStore, r as reactExports, M as MONTH_KEYS, t as tLang, j as jsxRuntimeExports, b as Link, F as FileText, X } from "./index-NKFMDfSM.js";
import { A as AdModal, C as CircleAlert } from "./AdModal-DKG9pWSy.js";
import { B as Button, f as Badge } from "./index-i7t4yTMw.js";
import { d as Dialog, e as DialogContent, f as DialogHeader, g as DialogTitle } from "./dialog-D0-wcGYn.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-TiDxaxb4.js";
import { S as ShieldCheck, a as Separator, b as Share2 } from "./separator-iCvOt6YE.js";
import { h as hasPremiumAccess, i as isAdminUser, S as Sparkles, C as CircleCheck, a as isBetaPeriodActive } from "./premium-DdpwIwfL.js";
import { m as motion } from "./proxy-sPmYolkV.js";
import "./index-COFaHO_8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
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
  "December"
];
const CATEGORY_COLORS$1 = {
  cab: [20, 148, 195],
  train: [34, 120, 80],
  bus: [130, 80, 200],
  localBus: [100, 60, 180],
  auto: [180, 120, 20],
  flight: [50, 120, 210],
  hotel: [200, 130, 20],
  meal: [200, 60, 60],
  other: [100, 100, 100]
};
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 10;
const HEADER_H = 18;
const THUMB_COLS = 3;
const THUMB_GAP = 4;
const THUMB_W = (CONTENT_W - THUMB_GAP * (THUMB_COLS - 1)) / THUMB_COLS;
const THUMB_H = THUMB_W * 0.75;
const LABEL_H = 5;
const ROW_H = THUMB_H + LABEL_H + THUMB_GAP;
function formatCurrency$1(amount) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
function formatDateLabel(dateStr) {
  try {
    const d = /* @__PURE__ */ new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}
async function compressToThumbnail(dataUrl) {
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
function buildCategoryBreakdown(receipts) {
  const map = /* @__PURE__ */ new Map();
  for (const r of receipts) {
    const ex = map.get(r.category);
    if (ex) {
      ex.total += r.amount ?? 0;
      ex.count += 1;
    } else {
      map.set(r.category, {
        category: r.category,
        total: r.amount ?? 0,
        count: 1
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}
function groupByDate(receipts) {
  const map = /* @__PURE__ */ new Map();
  const sorted = [...receipts].sort((a, b) => a.date.localeCompare(b.date));
  for (const r of sorted) {
    const arr = map.get(r.date) ?? [];
    arr.push(r);
    map.set(r.date, arr);
  }
  return map;
}
function addWatermark(doc) {
  var _a, _b;
  try {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    (_a = doc.saveGraphicsState) == null ? void 0 : _a.call(doc);
    doc.setGState(doc.GState({ opacity: 0.08 }));
    doc.setFontSize(40);
    doc.setTextColor(180, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("SAMPLE", w / 2, h / 2 - 16, { align: "center", angle: 45 });
    doc.text("FREE VERSION", w / 2, h / 2 + 16, { align: "center", angle: 45 });
    (_b = doc.restoreGraphicsState) == null ? void 0 : _b.call(doc);
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setTextColor(30, 30, 30);
  } catch {
  }
}
function drawMiniHeader(doc, left, right) {
  doc.setFillColor(12, 90, 110);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(left, MARGIN, 11.5);
  doc.text(right, PAGE_W - MARGIN, 11.5, { align: "right" });
  doc.setTextColor(30, 30, 30);
}
function drawCoverPage(doc, profile, receipts, month, year) {
  const monthName = MONTH_NAMES[month - 1];
  const reportTitle = `Expense Report — ${monthName} ${year}`;
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
  if (profile.companyName)
    doc.text(profile.companyName, PAGE_W - MARGIN, 18, { align: "right" });
  doc.text(profile.name || "—", PAGE_W - MARGIN, 29, { align: "right" });
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Prepared: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}`,
    MARGIN,
    51
  );
  doc.setFillColor(240, 252, 250);
  doc.rect(MARGIN, 57, CONTENT_W, 22, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("Grand Total", MARGIN + 7, 68);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(12, 90, 110);
  doc.text(formatCurrency$1(grandTotal), PAGE_W - MARGIN - 7, 68, {
    align: "right"
  });
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
    const rowColor = i % 2 === 0 ? [248, 252, 251] : [255, 255, 255];
    doc.setFillColor(...rowColor);
    doc.rect(MARGIN, y, CONTENT_W, 8, "F");
    const catColor = CATEGORY_COLORS$1[item.category] ?? [100, 100, 100];
    doc.setFillColor(...catColor);
    doc.rect(MARGIN, y, 3, 8, "F");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const label = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    doc.text(label, MARGIN + 7, y + 5.5);
    doc.text(String(item.count), PAGE_W / 2, y + 5.5, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency$1(item.total), PAGE_W - MARGIN - 5, y + 5.5, {
      align: "right"
    });
    y += 8;
  });
  doc.setFillColor(12, 90, 110);
  doc.rect(MARGIN, y, CONTENT_W, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", MARGIN + 7, y + 6);
  doc.text(formatCurrency$1(grandTotal), PAGE_W - MARGIN - 5, y + 6, {
    align: "right"
  });
}
function placeThumbnail(doc, thumb, rcp, xPos, yPos) {
  if (thumb) {
    try {
      const base64 = thumb.includes(",") ? thumb.split(",")[1] : thumb;
      doc.addImage(
        base64,
        "JPEG",
        xPos,
        yPos,
        THUMB_W,
        THUMB_H,
        void 0,
        "FAST"
      );
    } catch {
      doc.setFillColor(220, 220, 220);
      doc.rect(xPos, yPos, THUMB_W, THUMB_H, "F");
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("No image", xPos + THUMB_W / 2, yPos + THUMB_H / 2, {
        align: "center"
      });
    }
  } else {
    doc.setFillColor(220, 220, 220);
    doc.rect(xPos, yPos, THUMB_W, THUMB_H, "F");
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("No image", xPos + THUMB_W / 2, yPos + THUMB_H / 2, {
      align: "center"
    });
  }
  if (rcp.amount) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(12, 90, 110);
    doc.text(
      formatCurrency$1(rcp.amount),
      xPos + THUMB_W / 2,
      yPos + THUMB_H + 3.5,
      { align: "center" }
    );
  }
}
async function generateExpenseReport(profile, receipts, month, year, isFreeUser) {
  const jsPDF = (await __vitePreload(async () => {
    const { default: __vite_default__ } = await import("./jspdf.es.min-_j9THATd.js").then((n) => n.j);
    return { default: __vite_default__ };
  }, true ? __vite__mapDeps([0,1,2]) : void 0)).default;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  drawCoverPage(doc, profile, receipts, month, year);
  if (isFreeUser) addWatermark(doc);
  const thumbResults = await Promise.allSettled(
    receipts.map(
      (r) => r.imageData ? compressToThumbnail(r.imageData) : Promise.resolve(null)
    )
  );
  const thumbMap = /* @__PURE__ */ new Map();
  receipts.forEach((r, i) => {
    const result = thumbResults[i];
    thumbMap.set(r.id, result.status === "fulfilled" ? result.value : null);
  });
  const dayGroups = groupByDate(receipts);
  const USABLE_H = PAGE_H - FOOTER_H - 2;
  const DAY_HDR_H = 12;
  function ensureSpace(needed, currentY2) {
    if (currentY2 + needed > USABLE_H) {
      doc.addPage();
      drawMiniHeader(
        doc,
        "Fieldspend — Daily Receipts",
        `${MONTH_NAMES[month - 1]} ${year}`
      );
      if (isFreeUser) addWatermark(doc);
      return HEADER_H + 4;
    }
    return currentY2;
  }
  doc.addPage();
  drawMiniHeader(
    doc,
    "Fieldspend — Daily Receipts",
    `${MONTH_NAMES[month - 1]} ${year}`
  );
  if (isFreeUser) addWatermark(doc);
  let currentY = HEADER_H + 4;
  for (const [dateStr, dayReceipts] of dayGroups) {
    const dayTotal = dayReceipts.reduce((s, r) => s + (r.amount ?? 0), 0);
    const dateLabel = formatDateLabel(dateStr);
    currentY = ensureSpace(DAY_HDR_H + ROW_H, currentY);
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
      { align: "center" }
    );
    doc.setFont("helvetica", "bold");
    doc.setTextColor(12, 90, 110);
    doc.text(formatCurrency$1(dayTotal), PAGE_W - MARGIN - 4, currentY + 8, {
      align: "right"
    });
    currentY += DAY_HDR_H + 3;
    for (let i = 0; i < dayReceipts.length; i++) {
      const col = i % THUMB_COLS;
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
        yPos
      );
      if (col === THUMB_COLS - 1 || i === dayReceipts.length - 1) {
        currentY += ROW_H;
      }
    }
    currentY += THUMB_GAP;
  }
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(240, 245, 245);
    doc.rect(0, PAGE_H - FOOTER_H, PAGE_W, FOOTER_H, "F");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Fieldspend — Generated ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`,
      MARGIN,
      PAGE_H - 3.5
    );
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 3.5, {
      align: "right"
    });
  }
  return doc.output("blob");
}
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];
const CATEGORY_ICONS = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  localBus: "🚌",
  auto: "🛺",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋"
};
const CATEGORY_COLORS = {
  cab: "badge-cab",
  train: "badge-train",
  bus: "badge-bus",
  localBus: "badge-bus",
  auto: "badge-cab",
  flight: "badge-flight",
  hotel: "badge-hotel",
  meal: "badge-meal",
  other: "badge-other"
};
function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function getPeriodEndDate(month, year) {
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}
function PdfPreviewModal({
  open,
  onClose,
  blob,
  filename
}) {
  const [objectUrl, setObjectUrl] = reactExports.useState(null);
  const [canShare, setCanShare] = reactExports.useState(false);
  const prevBlobRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    if (prevBlobRef.current === blob && objectUrl) return;
    prevBlobRef.current = blob;
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);
    setCanShare(typeof navigator.share === "function");
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [open, blob, objectUrl]);
  function handleDownload() {
    if (!objectUrl) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.click();
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
      handleDownload();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-[96vw] w-full sm:max-w-2xl p-0 overflow-hidden rounded-2xl",
          "data-ocid": "pdf_preview.dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "flex flex-row items-center justify-between px-4 pt-4 pb-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-sm font-semibold truncate text-foreground max-w-[70%]", children: filename }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "rounded-full p-1.5 hover:bg-muted/60 transition-colors",
                  "aria-label": "Close preview",
                  "data-ocid": "pdf_preview.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-muted/30 mx-4 rounded-xl overflow-hidden",
                style: { height: "55vh" },
                children: objectUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "object",
                  {
                    data: objectUrl,
                    type: "application/pdf",
                    className: "w-full h-full",
                    "aria-label": "PDF preview",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-sm text-muted-foreground", children: "PDF preview not available in this browser. Use the download button below." })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 px-4 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "flex-1 gap-2 h-11 rounded-xl",
                  onClick: handleDownload,
                  "data-ocid": "pdf_preview.download_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
                    "Download PDF"
                  ]
                }
              ),
              canShare && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "flex-1 gap-2 h-11 rounded-xl",
                  onClick: handleShare,
                  "data-ocid": "pdf_preview.share_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 16 }),
                    "Share"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function CategoryRow({
  item,
  grandTotal,
  index,
  lang
}) {
  const pct = grandTotal > 0 ? item.total / grandTotal * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.06, duration: 0.3 },
      className: "flex items-center gap-3 py-3",
      "data-ocid": `reports.category.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0 w-6 text-center", children: CATEGORY_ICONS[item.category] ?? "📋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs shrink-0 ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other}`,
                children: tLang(`cat.${item.category}`, lang)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-2 shrink-0", children: [
              item.count,
              " ",
              item.count === 1 ? tLang("report.items", lang) : tLang("report.items_plural", lang)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "h-full bg-primary rounded-full",
              initial: { width: 0 },
              animate: { width: `${pct}%` },
              transition: { delay: index * 0.06 + 0.2, duration: 0.5 }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0 min-w-[72px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground font-mono", children: formatCurrency(item.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            pct.toFixed(0),
            "%"
          ] })
        ] })
      ]
    }
  );
}
function ReportsPage() {
  const {
    receipts,
    userProfile,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    currentLanguage
  } = useAppStore();
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [pdfBlob, setPdfBlob] = reactExports.useState(null);
  const [showPreview, setShowPreview] = reactExports.useState(false);
  const [showAd, setShowAd] = reactExports.useState(false);
  const [pendingPdf, setPendingPdf] = reactExports.useState(false);
  const monthNames = reactExports.useMemo(
    () => MONTH_KEYS.map((key) => tLang(key, currentLanguage)),
    [currentLanguage]
  );
  const filteredReceipts = reactExports.useMemo(
    () => receipts.filter((r) => {
      const d = new Date(r.date);
      return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
    }),
    [receipts, selectedMonth, selectedYear]
  );
  const breakdown = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of filteredReceipts) {
      const existing = map.get(r.category);
      if (existing) {
        existing.total += r.amount ?? 0;
        existing.count += 1;
      } else {
        map.set(r.category, {
          category: r.category,
          total: r.amount ?? 0,
          count: 1
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filteredReceipts]);
  const grandTotal = reactExports.useMemo(
    () => filteredReceipts.reduce((s, r) => s + (r.amount ?? 0), 0),
    [filteredReceipts]
  );
  const isPremium = userProfile ? hasPremiumAccess(userProfile) : false;
  const isAdmin = userProfile ? isAdminUser(userProfile) : false;
  const isFreeUser = !isPremium;
  const betaActive = isBetaPeriodActive();
  const shouldShowAd = !betaActive && isFreeUser && !isAdmin;
  const monthName = monthNames[selectedMonth - 1];
  const reportTitle = `${monthName} ${selectedYear}`;
  const pdfFilename = `Expense_Report_${getPeriodEndDate(selectedMonth, selectedYear)}.pdf`;
  function handleMonthChange(v) {
    setSelectedMonth(Number(v));
    setPdfBlob(null);
  }
  function handleYearChange(v) {
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
        isFreeUser
      );
      setPdfBlob(blob);
      setShowPreview(true);
    } catch {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdModal,
      {
        isOpen: showAd,
        onComplete: handleAdComplete,
        adNumber: 1,
        totalAds: 1
      }
    ),
    pdfBlob && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PdfPreviewModal,
      {
        open: showPreview,
        onClose: () => setShowPreview(false),
        blob: pdfBlob,
        filename: pdfFilename
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-5 space-y-5 pb-8", "data-ocid": "reports.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: tLang("report.title", currentLanguage) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: tLang("report.month", currentLanguage) })
        ] }),
        isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-secondary/10 border border-secondary/20 rounded-full px-3 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 13, className: "text-secondary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-secondary", children: "Premium" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", "data-ocid": "reports.period_selector", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: String(selectedMonth),
            onValueChange: handleMonthChange,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "flex-1 bg-card",
                  "data-ocid": "reports.month_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: monthNames.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, MONTH_KEYS[i])) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: String(selectedYear), onValueChange: handleYearChange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-28 bg-card",
              "data-ocid": "reports.year_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(y), children: y }, y)) })
        ] })
      ] }),
      isFreeUser && betaActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -6 },
          animate: { opacity: 1, y: 0 },
          className: "flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3",
          "data-ocid": "reports.watermark_banner",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleAlert,
              {
                size: 16,
                className: "text-amber-500 shrink-0 mt-0.5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-amber-700 dark:text-amber-400", children: tLang("report.watermark_note", currentLanguage) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "shrink-0 text-xs border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10",
                "data-ocid": "reports.upgrade_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 12, className: "mr-1" }),
                  tLang("report.upgrade", currentLanguage)
                ]
              }
            ) })
          ]
        }
      ),
      shouldShowAd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -6 },
          animate: { opacity: 1, y: 0 },
          className: "flex items-start gap-3 bg-muted/40 border border-border rounded-xl px-4 py-3",
          "data-ocid": "reports.ad_notice",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleAlert,
              {
                size: 16,
                className: "text-muted-foreground shrink-0 mt-0.5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground flex-1", children: [
              "A short ad plays before PDF download.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/settings",
                  className: "underline text-primary font-medium",
                  children: "Upgrade"
                }
              ),
              " ",
              "to remove ads."
            ] })
          ]
        }
      ),
      isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.97 },
          animate: { opacity: 1, scale: 1 },
          className: "flex items-center gap-2 bg-secondary/8 border border-secondary/20 rounded-xl px-4 py-2.5",
          "data-ocid": "reports.premium_badge",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15, className: "text-secondary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-secondary", children: [
              "Clean PDF — ",
              tLang("settings.no_watermark", currentLanguage)
            ] })
          ]
        }
      ),
      hasNoProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3",
          "data-ocid": "reports.profile_missing",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 15, className: "text-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-destructive flex-1", children: [
              tLang("report.set_profile", currentLanguage),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "underline font-semibold", children: tLang("report.set_profile2", currentLanguage) }),
              " ",
              tLang("report.set_profile3", currentLanguage)
            ] })
          ]
        }
      ),
      !hasNoProfile && !hasNoReceipts && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          className: "bg-card border border-border rounded-2xl overflow-hidden shadow-sm",
          "data-ocid": "reports.preview_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent border-b border-border px-5 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground truncate", children: userProfile == null ? void 0 : userProfile.name }),
                  (userProfile == null ? void 0 : userProfile.companyName) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: userProfile.companyName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-wide", children: tLang("report.title", currentLanguage) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: reportTitle })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: tLang("report.total", currentLanguage) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-3xl text-primary", children: formatCurrency(grandTotal) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  filteredReceipts.length,
                  " ",
                  tLang("report.receipts", currentLanguage),
                  " ·",
                  " ",
                  breakdown.length,
                  " ",
                  tLang("report.categories", currentLanguage)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: tLang("report.category_breakdown", currentLanguage) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: breakdown.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                CategoryRow,
                {
                  item,
                  grandTotal,
                  index: i,
                  lang: currentLanguage
                },
                item.category
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between py-1",
                  "data-ocid": "reports.total_row",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: tLang("report.total", currentLanguage) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary font-mono", children: formatCurrency(grandTotal) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 pb-1", children: [
                "📎 ",
                filteredReceipts.length,
                " ",
                filteredReceipts.length === 1 ? tLang("report.images_attached", currentLanguage) : tLang(
                  "report.images_attached_plural",
                  currentLanguage
                ),
                " ",
                "· 3 per row thumbnails"
              ] })
            ] })
          ]
        }
      ),
      hasNoReceipts && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.97 },
          animate: { opacity: 1, scale: 1 },
          className: "flex flex-col items-center py-12 text-center px-4",
          "data-ocid": "reports.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 28, className: "text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground mb-1", children: [
              tLang("report.no_receipts", currentLanguage),
              " ",
              reportTitle
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: monthName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "gap-2",
                "data-ocid": "reports.upload_cta",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 15 }),
                  " ",
                  tLang("report.add_first", currentLanguage)
                ]
              }
            ) })
          ]
        }
      ),
      !hasNoReceipts && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 },
          className: "space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full h-12 text-base font-semibold rounded-xl shadow-md gap-2 bg-primary hover:bg-primary/90",
                onClick: handleGenerate,
                disabled: isGenerating || hasNoProfile,
                "data-ocid": "reports.generate_button",
                children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" }),
                  tLang("report.generating", currentLanguage)
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18 }),
                  tLang("action.download", currentLanguage)
                ] })
              }
            ),
            pdfBlob && !isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "w-full h-10 rounded-xl gap-2 text-sm",
                onClick: () => setShowPreview(true),
                "data-ocid": "reports.reopen_preview_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 15 }),
                  "View / Share Last Report"
                ]
              }
            ),
            isFreeUser && !isGenerating && betaActive && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground", children: tLang("report.watermark_note", currentLanguage) }),
            shouldShowAd && !isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground", children: "📺 A short ad will play before download" })
          ]
        }
      )
    ] })
  ] });
}
export {
  ReportsPage as default
};

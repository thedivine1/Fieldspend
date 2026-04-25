const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-CtNTzrvf.js","assets/index-CF0nR3YV.js","assets/index-CZ0b9xTh.css"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, _ as __vitePreload, e as t, R as React, a as useAppStore, r as reactExports, M as MONTH_KEYS, t as tLang, j as jsxRuntimeExports, b as Link, F as FileText, d as ue } from "./index-CF0nR3YV.js";
import { A as AdModal, C as CircleAlert } from "./AdModal-DNONOCGv.js";
import { B as Button, j as Badge } from "./index-B5pZLSOB.js";
import { S as Select, b as SelectTrigger, c as SelectValue, d as SelectContent, e as SelectItem } from "./select-D9mEVm7r.js";
import { S as ShieldCheck, a as Separator, M as Mail } from "./separator-BNehHIA1.js";
import { h as hasPremiumAccess, i as isAdminUser, S as Sparkles, C as CircleCheck, a as isBetaPeriodActive } from "./premium-Hll_Pic7.js";
import { m as motion } from "./proxy-KEY2c1R9.js";
import "./index-B26f0ZnG.js";
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
  flight: [50, 120, 210],
  hotel: [200, 130, 20],
  meal: [200, 60, 60],
  other: [100, 100, 100]
};
function formatCurrency$1(amount) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function addWatermark(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setGState(doc.GState({ opacity: 0.12 }));
  doc.setFontSize(48);
  doc.setTextColor(180, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("SAMPLE", pageWidth / 2, pageHeight / 2 - 20, {
    align: "center",
    angle: 45
  });
  doc.text("FREE VERSION", pageWidth / 2, pageHeight / 2 + 20, {
    align: "center",
    angle: 45
  });
  doc.setGState(doc.GState({ opacity: 1 }));
  doc.setTextColor(0, 0, 0);
}
function buildCategoryBreakdown(receipts) {
  const map = /* @__PURE__ */ new Map();
  for (const r of receipts) {
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
}
async function generateExpenseReport(profile, receipts, month, year, isFreeUser) {
  const { jsPDF } = await __vitePreload(async () => {
    const { jsPDF: jsPDF2 } = await import("./jspdf.es.min-CtNTzrvf.js").then((n) => n.j);
    return { jsPDF: jsPDF2 };
  }, true ? __vite__mapDeps([0,1,2]) : void 0);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const monthName = MONTH_NAMES[month - 1];
  const reportTitle = `${t("report.title")} — ${monthName} ${year}`;
  const breakdown = buildCategoryBreakdown(receipts);
  const grandTotal = receipts.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  doc.setFillColor(12, 90, 110);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Fieldspend", 15, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(reportTitle, 15, 28);
  if (profile.companyName) {
    doc.text(profile.companyName, pageWidth - 15, 18, { align: "right" });
  }
  doc.text(profile.name, pageWidth - 15, 28, { align: "right" });
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Prepared: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
    15,
    50
  );
  doc.setFillColor(240, 252, 250);
  doc.roundedRect(15, 56, pageWidth - 30, 22, 3, 3, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(t("report.total"), 22, 67);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(12, 90, 110);
  doc.text(formatCurrency$1(grandTotal), pageWidth - 22, 67, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Total ${t("report.receipts")}: ${receipts.length}`, 22, 74);
  let y = 90;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Category Breakdown", 15, y);
  y += 8;
  doc.setFillColor(12, 90, 110);
  doc.rect(15, y, pageWidth - 30, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Category", 20, y + 5.5);
  doc.text("Count", pageWidth / 2, y + 5.5, { align: "center" });
  doc.text("Amount", pageWidth - 20, y + 5.5, { align: "right" });
  y += 8;
  breakdown.forEach((item, i) => {
    const rowColor = i % 2 === 0 ? [248, 252, 251] : [255, 255, 255];
    doc.setFillColor(...rowColor);
    doc.rect(15, y, pageWidth - 30, 8, "F");
    const catColor = CATEGORY_COLORS$1[item.category] ?? [100, 100, 100];
    doc.setFillColor(...catColor);
    doc.rect(15, y, 3, 8, "F");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const catLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    doc.text(catLabel, 22, y + 5.5);
    doc.text(String(item.count), pageWidth / 2, y + 5.5, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency$1(item.total), pageWidth - 20, y + 5.5, {
      align: "right"
    });
    y += 8;
  });
  doc.setFillColor(12, 90, 110);
  doc.rect(15, y, pageWidth - 30, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", 22, y + 6);
  doc.text(formatCurrency$1(grandTotal), pageWidth - 20, y + 6, {
    align: "right"
  });
  if (isFreeUser) addWatermark(doc);
  for (const receipt of receipts) {
    if (!receipt.imageData) continue;
    doc.addPage();
    doc.setFillColor(12, 90, 110);
    doc.rect(0, 0, pageWidth, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Receipt — ${receipt.date}`, 15, 12);
    const catLabel = receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1);
    doc.text(catLabel, pageWidth - 15, 12, { align: "right" });
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
        void 0,
        "FAST"
      );
    } catch {
    }
    if (receipt.amount) {
      doc.setTextColor(12, 90, 110);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency$1(receipt.amount), pageWidth - 15, 228, {
        align: "right"
      });
    }
    if (receipt.notes) {
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(receipt.notes, 15, 235, {
        maxWidth: pageWidth - 30
      });
    }
    if (isFreeUser) addWatermark(doc);
  }
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
      `Fieldspend — Generated ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`,
      15,
      pageH - 3.5
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, pageH - 3.5, {
      align: "right"
    });
  }
  return doc.output("blob");
}
var DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext = React.createContext && /* @__PURE__ */ React.createContext(DefaultContext);
var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t2) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t2);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t2.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t2 = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t2[n] = r[n];
  }
  return t2;
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r in t2) ({}).hasOwnProperty.call(t2, r) && (n[r] = t2[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t2 = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t2.push.apply(t2, o);
  }
  return t2;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t2 = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t2), true).forEach(function(r2) {
      _defineProperty(e, r2, t2[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t2) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t2, enumerable: true, configurable: true, writable: true }) : e[r] = t2, e;
}
function _toPropertyKey(t2) {
  var i = _toPrimitive(t2, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t2, r) {
  if ("object" != typeof t2 || !t2) return t2;
  var e = t2[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t2, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t2);
}
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /* @__PURE__ */ React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return (props) => /* @__PURE__ */ React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = (conf) => {
    var {
      attr,
      size,
      title
    } = props, svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /* @__PURE__ */ React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /* @__PURE__ */ React.createElement("title", null, title), props.children);
  };
  return IconContext !== void 0 ? /* @__PURE__ */ React.createElement(IconContext.Consumer, null, (conf) => elem(conf)) : elem(DefaultContext);
}
function SiWhatsapp(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" }, "child": [] }] })(props);
}
const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];
const CATEGORY_ICONS = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋"
};
const CATEGORY_COLORS = {
  cab: "badge-cab",
  train: "badge-train",
  bus: "badge-bus",
  flight: "badge-flight",
  hotel: "badge-hotel",
  meal: "badge-meal",
  other: "badge-other"
};
function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function buildEmailBody(breakdown, grandTotal, monthName, year, lang) {
  const lines = breakdown.map(
    (item) => `${tLang(`cat.${item.category}`, lang)}: ${formatCurrency(item.total)} (${item.count} ${item.count === 1 ? tLang("report.items", lang) : tLang("report.items_plural", lang)})`
  );
  lines.push(
    "",
    `${tLang("report.total", lang)}: ${formatCurrency(grandTotal)}`
  );
  return `${tLang("report.title", lang)} - ${monthName} ${year}

${lines.join("\n")}`;
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
  const [pdfReady, setPdfReady] = reactExports.useState(false);
  const [pdfBlob, setPdfBlob] = reactExports.useState(null);
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
  function handleMonthChange(v) {
    setSelectedMonth(Number(v));
    setPdfReady(false);
    setPdfBlob(null);
  }
  function handleYearChange(v) {
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
        isFreeUser
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expense-report-${selectedYear}-${String(selectedMonth).padStart(2, "0")}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e4);
      setPdfBlob(blob);
      setPdfReady(true);
      ue.success(tLang("status.saved", currentLanguage));
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
  function handleWhatsApp() {
    const text = encodeURIComponent(
      `${tLang("report.title", currentLanguage)}: ${reportTitle} — ${tLang("report.total", currentLanguage)}: ${formatCurrency(grandTotal)}

(PDF attached separately)`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }
  function handleEmail() {
    const subject = encodeURIComponent(
      `${tLang("report.title", currentLanguage)} - ${reportTitle}`
    );
    const body = encodeURIComponent(
      buildEmailBody(
        breakdown,
        grandTotal,
        monthName,
        selectedYear,
        currentLanguage
      )
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
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
                  " ",
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
                filteredReceipts.length === 1 ? tLang("report.images_attached", currentLanguage) : tLang("report.images_attached_plural", currentLanguage)
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
            isFreeUser && !isGenerating && betaActive && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground mt-2", children: tLang("report.watermark_note", currentLanguage) }),
            shouldShowAd && !isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground mt-2", children: "📺 A short ad will play before download" })
          ]
        }
      ),
      pdfReady && pdfBlob && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "space-y-3",
          "data-ocid": "reports.share_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center", children: tLang("report.share", currentLanguage) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleWhatsApp,
                  className: "flex items-center justify-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:bg-muted/40 transition-smooth active:scale-95",
                  "data-ocid": "reports.whatsapp_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SiWhatsapp, { size: 20, className: "text-[#25D366] shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: "WhatsApp" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: tLang("action.share", currentLanguage) })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleEmail,
                  className: "flex items-center justify-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:bg-muted/40 transition-smooth active:scale-95",
                  "data-ocid": "reports.email_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20, className: "text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: "Email" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: tLang("action.share", currentLanguage) })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center px-2", children: [
              "💡 ",
              tLang("report.whatsapp_note", currentLanguage)
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  ReportsPage as default
};

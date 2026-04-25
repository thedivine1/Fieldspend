import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, _ as __vitePreload, u as useNavigate, a as useAppStore, g as getDailyCount, d as ue, t as tLang, I as Image$1, C as Camera, X } from "./index-DZsRQdG0.js";
import { C as CircleAlert, A as AdModal } from "./AdModal-DiryTcgt.js";
import { k as Primitive, h as cn, B as Button, j as Badge } from "./index-B-QWpeOq.js";
import { L as Label, I as Input } from "./label-BzuSlc1o.js";
import { S as Select, b as SelectTrigger, c as SelectValue, d as SelectContent, e as SelectItem } from "./select-DD2C3PDr.js";
import { T as Textarea } from "./textarea-D15EJLM-.js";
import { i as isAdminUser, h as hasPremiumAccess, F as FREE_DAILY_LIMIT, S as Sparkles, C as CircleCheck, a as isBetaPeriodActive } from "./premium-BY9SNphz.js";
import { m as motion } from "./proxy-DLCgAu61.js";
import { S as Star } from "./star-hyK8ztuA.js";
import { A as AnimatePresence } from "./index-BexNpxAd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
async function enforcePortraitOrientation(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { naturalWidth: w, naturalHeight: h } = img;
      if (h >= w) {
        resolve(null);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = h;
      canvas.height = w;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.translate(h / 2, w / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });
}
function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], fileName, { type: mime });
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
const OCR_SPACE_URL = "https://api.ocr.space/parse/image";
const OCR_SPACE_KEY = "helloworld";
async function extractWithOcrSpace(source) {
  var _a, _b;
  let base64;
  let mimeType = "image/jpeg";
  if (typeof source === "string") {
    const parts = source.split(",");
    base64 = parts[1];
    const mimeMatch = parts[0].match(/:(.*?);/);
    if (mimeMatch) mimeType = mimeMatch[1];
  } else {
    base64 = await fileToBase64(source);
    mimeType = source.type || "image/jpeg";
  }
  const body = new FormData();
  body.append("base64Image", `data:${mimeType};base64,${base64}`);
  body.append("apikey", OCR_SPACE_KEY);
  body.append("language", "eng");
  body.append("OCREngine", "2");
  body.append("isTable", "true");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15e3);
  const response = await fetch(OCR_SPACE_URL, {
    method: "POST",
    body,
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  if (!response.ok) throw new Error(`OCR.Space HTTP ${response.status}`);
  const json = await response.json();
  if (json.IsErroredOnProcessing) throw new Error("OCR.Space processing error");
  const text = ((_b = (_a = json.ParsedResults) == null ? void 0 : _a[0]) == null ? void 0 : _b.ParsedText) ?? "";
  if (!text.trim()) throw new Error("OCR.Space returned empty text");
  return text;
}
async function extractWithTesseract(source) {
  const { createWorker } = await __vitePreload(async () => {
    const { createWorker: createWorker2 } = await import("./index-NYFB56d-.js").then((n) => n.i);
    return { createWorker: createWorker2 };
  }, true ? [] : void 0);
  const worker = await createWorker(["eng", "hin"]);
  const input = typeof source === "string" ? dataUrlToFile(source, "receipt.jpg") : source;
  const { data } = await worker.recognize(input);
  await worker.terminate();
  return data.text;
}
async function extractTextFromImage(source) {
  try {
    const text = await extractWithOcrSpace(source);
    return text;
  } catch {
    console.warn("[OCR] OCR.Space unavailable, falling back to Tesseract");
  }
  try {
    return await extractWithTesseract(source);
  } catch {
    return "";
  }
}
const HINDI_MONTHS = {
  जनवरी: 1,
  फरवरी: 2,
  मार्च: 3,
  अप्रैल: 4,
  मई: 5,
  जून: 6,
  जुलाई: 7,
  अगस्त: 8,
  सितम्बर: 9,
  अक्टूबर: 10,
  नवम्बर: 11,
  दिसम्बर: 12
};
const ENGLISH_MONTHS = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
};
function padDate(n) {
  return String(n).padStart(2, "0");
}
function toISODate(day, month, year) {
  return `${year}-${padDate(month)}-${padDate(day)}`;
}
function detectDate(text) {
  const dmyMatch = text.match(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/);
  if (dmyMatch) {
    const d = Number.parseInt(dmyMatch[1]);
    const m = Number.parseInt(dmyMatch[2]);
    const y = Number.parseInt(dmyMatch[3]);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
      return toISODate(d, m, y);
    }
  }
  const engMonthMatch = text.match(
    /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})\b/i
  );
  if (engMonthMatch) {
    const d = Number.parseInt(engMonthMatch[1]);
    const m = ENGLISH_MONTHS[engMonthMatch[2].toLowerCase()];
    const y = Number.parseInt(engMonthMatch[3]);
    if (m) return toISODate(d, m, y);
  }
  for (const [monthName, monthNum] of Object.entries(HINDI_MONTHS)) {
    const regex = new RegExp(`(\\d{1,2})\\s+${monthName}\\s+(\\d{4})`);
    const match = text.match(regex);
    if (match) {
      const d = Number.parseInt(match[1]);
      const y = Number.parseInt(match[2]);
      return toISODate(d, monthNum, y);
    }
  }
  const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }
  return null;
}
const CATEGORY_KEYWORDS = {
  cab: [
    "uber",
    "ola",
    "rapido",
    "namma yatri",
    "taxi",
    "cab",
    "auto",
    "rickshaw",
    "autorickshaw",
    "rikshaw"
  ],
  flight: [
    "indigo",
    "air india",
    "spicejet",
    "vistara",
    "goair",
    "akasa",
    "airasia",
    "airline",
    "airport",
    "boarding",
    "departure",
    "arrival",
    "pnr",
    "seat no"
  ],
  train: [
    "irctc",
    "indian railways",
    "railway",
    "train",
    "station",
    "sleeper",
    "berth",
    "platform",
    "reservation",
    "pnr",
    "express"
  ],
  bus: [
    "msrtc",
    "gsrtc",
    "ksrtc",
    "st bus",
    "redbus",
    "state transport",
    "bus",
    "volvo",
    "travels",
    "roadways"
  ],
  hotel: [
    "hotel",
    "lodge",
    "inn",
    "stay",
    "accommodation",
    "resort",
    "guest house",
    "guesthouse",
    "oyo",
    "makemytrip hotel",
    "room"
  ],
  meal: [
    "restaurant",
    "cafe",
    "food",
    "meal",
    "lunch",
    "dinner",
    "breakfast",
    "dhaba",
    "thali",
    "snacks",
    "beverages",
    "swiggy",
    "zomato",
    "tea",
    "chai",
    "biryani"
  ],
  other: []
};
function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (cat === "other") continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  return null;
}
function parseAmount(raw) {
  const cleaned = raw.replace(/,/g, "").trim();
  const val = Number.parseFloat(cleaned);
  return Number.isNaN(val) || val <= 0 ? null : val;
}
function detectAmount(text) {
  const AMOUNT_NUM = /[\d]{1,3}(?:,\d{3})*(?:\.\d{1,2})?/;
  const highConfidencePattern = new RegExp(
    `(?:grand\\s+total|net\\s+payable|total\\s+amount|subtotal|net\\s+total)\\s*[:\\-]?\\s*(?:₹|rs\\.?|inr)?\\s*(${AMOUNT_NUM.source})`,
    "i"
  );
  const highMatch = text.match(highConfidencePattern);
  if (highMatch) {
    const val = parseAmount(highMatch[1]);
    if (val) return val;
  }
  const currencyPattern = new RegExp(
    `(?:₹|rs\\.?|inr)\\s*(${AMOUNT_NUM.source})`,
    "gi"
  );
  const currencyMatches = [...text.matchAll(currencyPattern)];
  if (currencyMatches.length > 0) {
    const amounts = currencyMatches.map((m) => parseAmount(m[1])).filter((v) => v !== null);
    if (amounts.length > 0) return Math.max(...amounts);
  }
  const labelledPattern = new RegExp(
    `(?:total|amount|payable|net|bill|charge)\\s*[:\\-]?\\s*(${AMOUNT_NUM.source})`,
    "i"
  );
  const labelledMatch = text.match(labelledPattern);
  if (labelledMatch) {
    const val = parseAmount(labelledMatch[1]);
    if (val) return val;
  }
  return null;
}
const UPLOAD_COUNT_KEY = "fieldspend_upload_count";
const UPLOAD_DATE_KEY = "fieldspend_upload_date";
function getTodayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function getUploadCount() {
  const storedDate = localStorage.getItem(UPLOAD_DATE_KEY);
  if (storedDate !== getTodayStr()) {
    localStorage.setItem(UPLOAD_DATE_KEY, getTodayStr());
    localStorage.setItem(UPLOAD_COUNT_KEY, "0");
    return 0;
  }
  return Number(localStorage.getItem(UPLOAD_COUNT_KEY) ?? "0");
}
function incrementUploadCount() {
  const count = getUploadCount() + 1;
  localStorage.setItem(UPLOAD_COUNT_KEY, String(count));
  return count;
}
const CATEGORIES = [
  "cab",
  "train",
  "bus",
  "flight",
  "hotel",
  "meal",
  "other"
];
const CATEGORY_COLORS = {
  cab: "badge-cab",
  train: "badge-train",
  bus: "badge-bus",
  flight: "badge-flight",
  hotel: "badge-hotel",
  meal: "badge-meal",
  other: "badge-other"
};
const CATEGORY_ICONS = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋"
};
const MAX_QUEUE = 5;
const TODAY = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function QueueItemCard({
  item,
  index,
  isActive,
  onSelect,
  onRemove
}) {
  const { currentLanguage } = useAppStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 16 },
      transition: { duration: 0.2 },
      className: `flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-smooth ${isActive ? "border-primary/60 bg-primary/5" : "border-border bg-card hover:border-primary/30"}`,
      onClick: onSelect,
      "data-ocid": `upload.queue_item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.previewUrl,
              alt: `Receipt ${index + 1}`,
              className: "w-full h-full object-cover"
            }
          ),
          item.status === "processing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "text-primary animate-spin" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground truncate", children: [
            CATEGORY_ICONS[item.category],
            " ",
            tLang(`cat.${item.category}`, currentLanguage)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: [
            item.date || tLang("status.processing", currentLanguage),
            item.amount ? ` · ₹${item.amount}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
          item.status === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-secondary" }),
          item.status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18, className: "text-destructive" }),
          item.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors",
              onClick: (e) => {
                e.stopPropagation();
                onRemove();
              },
              "aria-label": "Remove",
              "data-ocid": `upload.queue_remove.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
            }
          )
        ] })
      ]
    }
  );
}
function UploadPage() {
  const navigate = useNavigate();
  const { addReceipt, userProfile, currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const cameraRef = reactExports.useRef(null);
  const galleryRef = reactExports.useRef(null);
  const [queue, setQueue] = reactExports.useState([]);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [dailyCount, setDailyCount] = reactExports.useState(0);
  const [limitChecked, setLimitChecked] = reactExports.useState(false);
  const [adGateQueue, setAdGateQueue] = reactExports.useState(0);
  const [currentAd, setCurrentAd] = reactExports.useState(0);
  const [pendingSaveAfterAd, setPendingSaveAfterAd] = reactExports.useState(false);
  reactExports.useEffect(() => {
    getDailyCount(TODAY).then((count) => {
      setDailyCount(count);
      setLimitChecked(true);
    }).catch(() => setLimitChecked(true));
  }, []);
  const isAdmin = userProfile ? isAdminUser(userProfile) : false;
  const isPremium = userProfile ? hasPremiumAccess(userProfile) : false;
  const limitReached = !isPremium && limitChecked && dailyCount >= FREE_DAILY_LIMIT;
  const canUpload = isPremium || !limitChecked || limitChecked && dailyCount < FREE_DAILY_LIMIT;
  const slotsLeft = Math.max(0, FREE_DAILY_LIMIT - dailyCount);
  const shouldShowAds = !isBetaPeriodActive() && !isPremium && !isAdmin;
  const activeItem = queue[activeIndex] ?? null;
  const processFile = reactExports.useCallback(async (itemId, file) => {
    setQueue(
      (prev) => prev.map((q) => q.id === itemId ? { ...q, status: "processing" } : q)
    );
    try {
      const rotatedDataUrl = await enforcePortraitOrientation(file);
      if (rotatedDataUrl) {
        setQueue(
          (prev) => prev.map(
            (q) => q.id === itemId ? {
              ...q,
              previewUrl: rotatedDataUrl,
              imageDataUrl: rotatedDataUrl
            } : q
          )
        );
      }
      const ocrSource = rotatedDataUrl ?? file;
      const text = await extractTextFromImage(ocrSource);
      const detectedDate = detectDate(text);
      const detectedCategory = detectCategory(text);
      const detectedAmount = detectAmount(text);
      setQueue(
        (prev) => prev.map(
          (q) => q.id === itemId ? {
            ...q,
            status: "pending",
            ocrAttempted: true,
            ocrFailed: false,
            date: detectedDate ?? q.date,
            category: detectedCategory ?? q.category,
            amount: detectedAmount != null ? String(detectedAmount) : q.amount
          } : q
        )
      );
    } catch {
      setQueue(
        (prev) => prev.map(
          (q) => q.id === itemId ? { ...q, status: "pending", ocrAttempted: true, ocrFailed: true } : q
        )
      );
    }
  }, []);
  const enqueueFiles = reactExports.useCallback(
    (files) => {
      if (!canUpload) {
        ue.error(tLang("status.limit_reached", lang));
        return;
      }
      const remaining = MAX_QUEUE - queue.length;
      const toAdd = files.slice(0, remaining).filter((f) => f.type.startsWith("image/"));
      if (toAdd.length === 0) return;
      const newItems = toAdd.map((file) => ({
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
        ocrFailed: false
      }));
      setQueue((prev) => {
        const updated = [...prev, ...newItems];
        if (prev.length === 0) setActiveIndex(0);
        return updated;
      });
      for (const item of newItems) processFile(item.id, item.file);
    },
    [canUpload, queue.length, processFile, lang]
  );
  const handleCameraChange = (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (f) enqueueFiles([f]);
    e.target.value = "";
  };
  const handleGalleryChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) enqueueFiles(Array.from(files));
    e.target.value = "";
  };
  const removeItem = (index) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((prev) => Math.min(prev, Math.max(0, queue.length - 2)));
  };
  function updateActive(patch) {
    setQueue(
      (prev) => prev.map((q, i) => i === activeIndex ? { ...q, ...patch } : q)
    );
  }
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
        const imageData = item.imageDataUrl ?? await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            var _a;
            const result = (_a = e.target) == null ? void 0 : _a.result;
            if (typeof result === "string") resolve(result);
            else reject(new Error("Failed to read file"));
          };
          reader.onerror = reject;
          reader.readAsDataURL(item.file);
        });
        const receipt = {
          id: generateId(),
          imageData,
          date: item.date,
          category: item.category,
          amount: item.amount ? Number.parseFloat(item.amount) : void 0,
          notes: item.notes || void 0,
          createdAt: Date.now()
        };
        await addReceipt(receipt);
        setQueue(
          (prev) => prev.map((q) => q.id === item.id ? { ...q, status: "done" } : q)
        );
        savedCount++;
        if (shouldShowAds) {
          const newCount = incrementUploadCount();
          if (newCount % 5 === 0) {
            setPendingSaveAfterAd(true);
          }
        }
      } catch {
        setQueue(
          (prev) => prev.map((q) => q.id === item.id ? { ...q, status: "error" } : q)
        );
      }
    }
    setIsSaving(false);
    if (savedCount > 0) {
      ue.success(
        savedCount === 1 ? tLang("status.saved", lang) : `${savedCount} receipts saved!`
      );
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
  if (limitChecked && limitReached) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-4 py-8 flex flex-col items-center text-center gap-6",
        "data-ocid": "upload.limit_reached",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className: "w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 36, className: "text-destructive" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "Daily Limit Reached" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2 max-w-xs", children: [
              tLang("status.limit_reached", lang),
              " — Upgrade to Premium for unlimited uploads."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Today's usage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                dailyCount,
                "/",
                FREE_DAILY_LIMIT
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Progress,
              {
                value: dailyCount / FREE_DAILY_LIMIT * 100,
                className: "h-2",
                "data-ocid": "upload.limit_progress"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "w-full gap-2",
                size: "lg",
                "data-ocid": "upload.upgrade_button",
                onClick: () => navigate({ to: "/settings" }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 18 }),
                  tLang("action.upgrade", lang),
                  " · ₹49/mo"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full",
                onClick: () => navigate({ to: "/gallery" }),
                "data-ocid": "upload.back_to_gallery",
                children: "View Gallery"
              }
            )
          ] })
        ]
      }
    );
  }
  if (queue.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 space-y-6", "data-ocid": "upload.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: cameraRef,
          type: "file",
          accept: "image/*",
          capture: "environment",
          className: "hidden",
          onChange: handleCameraChange,
          "aria-label": "Camera capture"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: galleryRef,
          type: "file",
          accept: "image/*",
          multiple: true,
          className: "hidden",
          onChange: handleGalleryChange,
          "aria-label": "Gallery select"
        }
      ),
      limitChecked && !isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -8 },
          animate: { opacity: 1, y: 0 },
          className: "bg-card border border-border rounded-xl p-4 space-y-2",
          "data-ocid": "upload.usage_bar",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Today's receipts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
                dailyCount,
                "/",
                FREE_DAILY_LIMIT
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Progress,
              {
                value: dailyCount / FREE_DAILY_LIMIT * 100,
                className: "h-1.5"
              }
            ),
            slotsLeft <= 3 && slotsLeft > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-warning", children: [
              "Only ",
              slotsLeft,
              " upload",
              slotsLeft > 1 ? "s" : "",
              " left today"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center space-y-6",
          "data-ocid": "upload.dropzone",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { size: 36, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Add Receipt Photos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  "Up to ",
                  MAX_QUEUE,
                  " receipts at once · OCR auto-reads dates & amounts"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "lg",
                  className: "flex-col h-20 gap-2 border-2 hover:border-primary/50 hover:bg-primary/5",
                  onClick: () => {
                    var _a;
                    return (_a = cameraRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "upload.camera_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 24, className: "text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: tLang("upload.camera", lang) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "lg",
                  className: "flex-col h-20 gap-2 border-2 hover:border-primary/50 hover:bg-primary/5",
                  onClick: () => {
                    var _a;
                    return (_a = galleryRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "upload.gallery_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { size: 24, className: "text-secondary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: tLang("upload.gallery", lang) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Supports JPG, PNG, HEIC · Hindi & English text supported" })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdModal,
      {
        isOpen: adGateQueue > 0,
        onComplete: handleAdComplete,
        adNumber: currentAd,
        totalAds: 2
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", "data-ocid": "upload.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: cameraRef,
          type: "file",
          accept: "image/*",
          capture: "environment",
          className: "hidden",
          onChange: handleCameraChange,
          "aria-label": "Camera capture"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: galleryRef,
          type: "file",
          accept: "image/*",
          multiple: true,
          className: "hidden",
          onChange: handleGalleryChange,
          "aria-label": "Gallery select"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold text-foreground", children: [
          queue.length,
          " receipt",
          queue.length > 1 ? "s" : "",
          " queued"
        ] }),
        queue.length < MAX_QUEUE && canUpload && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            className: "text-primary gap-1.5 h-8",
            onClick: () => {
              var _a;
              return (_a = galleryRef.current) == null ? void 0 : _a.click();
            },
            "data-ocid": "upload.add_more_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { size: 14 }),
              " Add more"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "upload.queue_list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: queue.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        QueueItemCard,
        {
          item,
          index: i,
          isActive: i === activeIndex,
          onSelect: () => setActiveIndex(i),
          onRemove: () => removeItem(i)
        },
        item.id
      )) }) }),
      activeItem && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          className: "bg-card border border-border rounded-2xl overflow-hidden",
          "data-ocid": "upload.receipt_editor",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-52 bg-muted", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: activeItem.previewUrl,
                  alt: "Receipt preview",
                  className: "w-full h-full object-cover"
                }
              ),
              activeItem.status === "processing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2",
                  "data-ocid": "upload.processing_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      LoaderCircle,
                      {
                        size: 28,
                        className: "text-primary animate-spin"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: tLang("status.processing", lang) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Reading receipt with OCR…" })
                  ]
                }
              ),
              activeItem.imageDataUrl && !activeItem.ocrFailed && activeItem.ocrAttempted && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  className: "absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 text-foreground text-xs font-medium shadow",
                  children: "🔄 Portrait"
                }
              ),
              activeItem.ocrAttempted && !activeItem.ocrFailed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  className: "absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shadow-md",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 12 }),
                    " OCR filled"
                  ]
                }
              ),
              activeItem.ocrFailed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/90 text-destructive-foreground text-xs px-3 py-2 rounded-lg flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Couldn't read receipt — fill in details manually" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "flex-shrink-0",
                    onClick: () => processFile(activeItem.id, activeItem.file),
                    "aria-label": "Retry OCR",
                    "data-ocid": "upload.retry_ocr",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 })
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "date", className: "text-xs font-medium", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "date",
                    type: "date",
                    value: activeItem.date,
                    onChange: (e) => updateActive({ date: e.target.value }),
                    "data-ocid": "upload.date_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", className: "text-xs font-medium", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: activeItem.category,
                      onValueChange: (v) => updateActive({ category: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            id: "category",
                            className: "flex-1",
                            "data-ocid": "upload.category_select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: CATEGORY_ICONS[cat] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tLang(`cat.${cat}`, lang) })
                        ] }) }, cat)) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `flex-shrink-0 text-xs ${CATEGORY_COLORS[activeItem.category]}`,
                      variant: "secondary",
                      children: CATEGORY_ICONS[activeItem.category]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", className: "text-xs font-medium", children: "Amount (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground", children: "₹" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "amount",
                      type: "number",
                      placeholder: "0.00",
                      className: "pl-7",
                      value: activeItem.amount,
                      onChange: (e) => updateActive({ amount: e.target.value }),
                      "data-ocid": "upload.amount_input"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", className: "text-xs font-medium", children: "Notes (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "notes",
                    placeholder: "Vendor name, purpose…",
                    value: activeItem.notes,
                    maxLength: 200,
                    rows: 2,
                    className: "resize-none text-sm",
                    onChange: (e) => updateActive({ notes: e.target.value }),
                    "data-ocid": "upload.notes_textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
                  activeItem.notes.length,
                  "/200"
                ] })
              ] })
            ] })
          ]
        },
        activeItem.id
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full gap-2",
            size: "lg",
            onClick: handleSaveAll,
            disabled: isSaving || queue.every((q) => q.status === "processing"),
            "data-ocid": "upload.save_button",
            children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 18, className: "animate-spin" }),
              "Saving…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
              "Add to Gallery (",
              queue.filter((q) => q.status !== "done").length,
              ")"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            className: "w-full text-muted-foreground",
            onClick: () => navigate({ to: "/gallery" }),
            "data-ocid": "upload.discard_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14, className: "mr-1.5" }),
              "Discard all"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  UploadPage as default
};

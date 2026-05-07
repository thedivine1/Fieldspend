import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, _ as __vitePreload, u as useNavigate, a as useAppStore, g as getDailyCount, t as tLang, I as Image$1, C as Camera, d as ue, X } from "./index-Q7Jk8N_s.js";
import { C as CircleAlert, A as AdModal } from "./AdModal-DYZNHtbg.js";
import { P as Primitive, d as cn, B as Button, f as Badge } from "./index-C6_FkSE_.js";
import { L as Label, I as Input } from "./label-Dvoh2DwD.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-9qOUQ768.js";
import { T as Textarea } from "./textarea-CJb5dntc.js";
import { i as isAdminUser, h as hasPremiumAccess, g as getAllowedUploadCount, F as FREE_DAILY_LIMIT, n as needsAdForUpload, S as Sparkles, C as CircleCheck, a as isBetaPeriodActive } from "./premium-Bn9eQttf.js";
import { m as motion } from "./proxy-oEYfaByQ.js";
import { S as Star } from "./star-DJIq9R3r.js";
import { A as AnimatePresence } from "./index-CmqUWI1H.js";
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
function readExifOrientation(file) {
  return new Promise((resolve) => {
    if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
      resolve(1);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      try {
        const buffer = (_a = e.target) == null ? void 0 : _a.result;
        if (!buffer || buffer.byteLength < 12) {
          resolve(1);
          return;
        }
        const view = new DataView(buffer);
        if (view.getUint16(0) !== 65496) {
          resolve(1);
          return;
        }
        let offset = 2;
        while (offset + 4 < buffer.byteLength) {
          const marker = view.getUint16(offset);
          const length = view.getUint16(offset + 2);
          if (marker === 65505) {
            const exifHeader = view.getUint32(offset + 4);
            if (exifHeader !== 1165519206) {
              resolve(1);
              return;
            }
            const tiffOffset = offset + 10;
            const littleEndian = view.getUint16(tiffOffset) === 18761;
            const readUint16 = (o) => view.getUint16(tiffOffset + o, littleEndian);
            const readUint32 = (o) => view.getUint32(tiffOffset + o, littleEndian);
            if (readUint16(0) !== (littleEndian ? 18761 : 19789)) {
            }
            const ifdOffset = readUint32(4);
            const entries = readUint16(ifdOffset);
            for (let i = 0; i < entries; i++) {
              const entryOffset = ifdOffset + 2 + i * 12;
              if (entryOffset + 12 > buffer.byteLength - tiffOffset) break;
              const tag = readUint16(entryOffset);
              if (tag === 274) {
                const orientation = readUint16(entryOffset + 8);
                resolve(orientation);
                return;
              }
            }
          }
          offset += 2 + length;
        }
        resolve(1);
      } catch {
        resolve(1);
      }
    };
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 65536));
  });
}
function applyOrientation(img, orientation) {
  const { naturalWidth: w, naturalHeight: h } = img;
  const needsRotationFallback = orientation === 1 && w > h;
  const effectiveOrientation = needsRotationFallback ? 6 : orientation;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }
  if (effectiveOrientation >= 5 && effectiveOrientation <= 8) {
    canvas.width = h;
    canvas.height = w;
  } else {
    canvas.width = w;
    canvas.height = h;
  }
  switch (effectiveOrientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, w, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, w, h);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, h);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, h, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, h, w);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, w);
      break;
  }
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}
function toGrayscale(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const gray = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] = data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114;
  }
  return gray;
}
function sobelEdges(gray, w, h) {
  const edges = new Uint8Array(w * h);
  let maxMag = 0;
  const mags = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const gx = -gray[(y - 1) * w + (x - 1)] + gray[(y - 1) * w + (x + 1)] + -2 * gray[y * w + (x - 1)] + 2 * gray[y * w + (x + 1)] + -gray[(y + 1) * w + (x - 1)] + gray[(y + 1) * w + (x + 1)];
      const gy = -gray[(y - 1) * w + (x - 1)] + -2 * gray[(y - 1) * w + x] + -gray[(y - 1) * w + (x + 1)] + gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];
      const mag = Math.sqrt(gx * gx + gy * gy);
      mags[idx] = mag;
      if (mag > maxMag) maxMag = mag;
    }
  }
  if (maxMag > 0) {
    for (let i = 0; i < w * h; i++) {
      edges[i] = mags[i] / maxMag * 255;
    }
  }
  return edges;
}
function findReceiptBounds(edges, w, h) {
  const THRESHOLD = 76;
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  let edgeCount = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (edges[y * w + x] >= THRESHOLD) {
        edgeCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (edgeCount < 100) return null;
  const boxW = maxX - minX;
  const boxH = maxY - minY;
  const coverageX = boxW / w;
  const coverageY = boxH / h;
  if (coverageX < 0.2 || coverageY < 0.2 || coverageX > 0.95 || coverageY > 0.95) {
    return null;
  }
  const padX = Math.floor(w * 0.02);
  const padY = Math.floor(h * 0.02);
  return {
    x: Math.max(0, minX - padX),
    y: Math.max(0, minY - padY),
    w: Math.min(w, maxX + padX) - Math.max(0, minX - padX),
    h: Math.min(h, maxY + padY) - Math.max(0, minY - padY)
  };
}
function detectReceiptBounds(sourceCanvas) {
  try {
    const origW = sourceCanvas.width;
    const origH = sourceCanvas.height;
    const scale = Math.min(1, 400 / origW);
    const sW = Math.floor(origW * scale);
    const sH = Math.floor(origH * scale);
    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = sW;
    smallCanvas.height = sH;
    const smallCtx = smallCanvas.getContext("2d");
    if (!smallCtx) return null;
    smallCtx.drawImage(sourceCanvas, 0, 0, sW, sH);
    const gray = toGrayscale(smallCtx, sW, sH);
    const edges = sobelEdges(gray, sW, sH);
    const bounds = findReceiptBounds(edges, sW, sH);
    if (!bounds) return null;
    return {
      x: Math.floor(bounds.x / scale),
      y: Math.floor(bounds.y / scale),
      w: Math.ceil(bounds.w / scale),
      h: Math.ceil(bounds.h / scale)
    };
  } catch {
    return null;
  }
}
function cropCanvas(source, bounds) {
  const canvas = document.createElement("canvas");
  canvas.width = bounds.w;
  canvas.height = bounds.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.drawImage(
    source,
    bounds.x,
    bounds.y,
    bounds.w,
    bounds.h,
    0,
    0,
    bounds.w,
    bounds.h
  );
  return canvas;
}
function resizeCanvas(source) {
  const MAX_W = 800;
  const MAX_H = 1024;
  const origW = source.width;
  const origH = source.height;
  if (origW <= MAX_W && origH <= MAX_H) return source;
  const scaleW = MAX_W / origW;
  const scaleH = MAX_H / origH;
  const scale = Math.min(scaleW, scaleH);
  const newW = Math.floor(origW * scale);
  const newH = Math.floor(origH * scale);
  const canvas = document.createElement("canvas");
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, newW, newH);
  return canvas;
}
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}
async function processImage(file) {
  try {
    const [img, orientation] = await Promise.all([
      loadImageFromFile(file),
      readExifOrientation(file)
    ]);
    let canvas = applyOrientation(img, orientation);
    try {
      const bounds = detectReceiptBounds(canvas);
      if (bounds && bounds.w > 50 && bounds.h > 50) {
        canvas = cropCanvas(canvas, bounds);
      }
    } catch {
    }
    canvas = resizeCanvas(canvas);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        var _a;
        const result = (_a = e.target) == null ? void 0 : _a.result;
        if (typeof result === "string") resolve(result);
        else reject(new Error("FileReader failed"));
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(file);
    });
  }
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
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
let workerInstance = null;
let workerInitPromise = null;
async function getTesseractWorker() {
  if (workerInstance) return workerInstance;
  if (workerInitPromise) return workerInitPromise;
  workerInitPromise = (async () => {
    const { createWorker } = await __vitePreload(async () => {
      const { createWorker: createWorker2 } = await import("./index-NYFB56d-.js").then((n) => n.i);
      return { createWorker: createWorker2 };
    }, true ? [] : void 0);
    const worker = await createWorker(["eng", "hin"]);
    workerInstance = worker;
    return worker;
  })();
  return workerInitPromise;
}
async function extractWithTesseract(source) {
  const worker = await getTesseractWorker();
  const input = typeof source === "string" ? dataUrlToFile(source, "receipt.jpg") : source;
  const { data } = await worker.recognize(input);
  return data.text;
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
async function extractTextFromImage(source) {
  try {
    const text = await extractWithTesseract(source);
    if (text.trim()) return text;
  } catch {
  }
  try {
    return await extractWithOcrSpace(source);
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
  const normalised = text.replace(/(?:date|दिनांक|dated)\s*[:\-]\s*/gi, "").trim();
  const dmyMatch = normalised.match(
    /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/
  );
  if (dmyMatch) {
    const d = Number.parseInt(dmyMatch[1]);
    const m = Number.parseInt(dmyMatch[2]);
    const y = Number.parseInt(dmyMatch[3]);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) return toISODate(d, m, y);
  }
  const isoMatch = normalised.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    const y = Number.parseInt(isoMatch[1]);
    const m = Number.parseInt(isoMatch[2]);
    const d = Number.parseInt(isoMatch[3]);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) return toISODate(d, m, y);
  }
  const engMonthMatch = normalised.match(
    /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})\b/i
  );
  if (engMonthMatch) {
    const d = Number.parseInt(engMonthMatch[1]);
    const m = ENGLISH_MONTHS[engMonthMatch[2].toLowerCase()];
    const y = Number.parseInt(engMonthMatch[3]);
    if (m) return toISODate(d, m, y);
  }
  const usMonthMatch = normalised.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2}),?\s+(\d{4})\b/i
  );
  if (usMonthMatch) {
    const m = ENGLISH_MONTHS[usMonthMatch[1].toLowerCase()];
    const d = Number.parseInt(usMonthMatch[2]);
    const y = Number.parseInt(usMonthMatch[3]);
    if (m) return toISODate(d, m, y);
  }
  for (const [monthName, monthNum] of Object.entries(HINDI_MONTHS)) {
    const regex = new RegExp(`(\\d{1,2})\\s+${monthName}\\s+(\\d{4})`);
    const match = normalised.match(regex);
    if (match) {
      const d = Number.parseInt(match[1]);
      const y = Number.parseInt(match[2]);
      return toISODate(d, monthNum, y);
    }
  }
  return null;
}
const CATEGORY_KEYWORDS = {
  cab: ["uber", "ola", "rapido", "namma yatri", "taxi", "cab"],
  auto: ["auto rickshaw", "autorickshaw", "rikshaw", "three wheeler", "auto"],
  localBus: [
    "local bus",
    "city bus",
    "brts",
    "pmpml",
    "bmtc",
    "best bus",
    "amts"
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
    "airways",
    "flight"
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
    "express"
  ],
  bus: [
    "msrtc",
    "gsrtc",
    "ksrtc",
    "st bus",
    "redbus",
    "state transport",
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
  const orderedCategories = [
    "localBus",
    "train",
    "flight",
    "hotel",
    "cab",
    "auto",
    "bus",
    "meal"
  ];
  for (const cat of orderedCategories) {
    const keywords = CATEGORY_KEYWORDS[cat];
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
  const AMOUNT_NUM = /[\d]{1,3}(?:,\d{3})*(?:\.\d{0,2})?/;
  const highConfidencePattern = new RegExp(
    `(?:grand\\s+total|net\\s+payable|total\\s+amount|amount\\s+due|net\\s+total|subtotal)\\s*[:\\-]?\\s*(?:₹|rs\\.?|inr)?\\s*(${AMOUNT_NUM.source})`,
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
const TOTAL_UPLOAD_KEY = "fieldspend_total_uploads";
const UPLOAD_DATE_KEY = "fieldspend_upload_date";
function getTodayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function getUploadCount() {
  const storedDate = localStorage.getItem(UPLOAD_DATE_KEY);
  if (storedDate !== getTodayStr()) {
    localStorage.setItem(UPLOAD_DATE_KEY, getTodayStr());
    localStorage.setItem("fieldspend_upload_count", "0");
    return 0;
  }
  return Number(localStorage.getItem("fieldspend_upload_count") ?? "0");
}
function incrementUploadCount() {
  const count = getUploadCount() + 1;
  localStorage.setItem("fieldspend_upload_count", String(count));
  return count;
}
function getTotalUploads() {
  return Number(localStorage.getItem(TOTAL_UPLOAD_KEY) ?? "0");
}
function incrementTotalUploads() {
  const count = getTotalUploads() + 1;
  localStorage.setItem(TOTAL_UPLOAD_KEY, String(count));
  return count;
}
const CATEGORIES = [
  "cab",
  "auto",
  "localBus",
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
  localBus: "badge-bus",
  auto: "badge-cab",
  flight: "badge-flight",
  hotel: "badge-hotel",
  meal: "badge-meal",
  other: "badge-other"
};
const CATEGORY_ICONS = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  localBus: "🚐",
  auto: "🛺",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋"
};
const MAX_QUEUE = 10;
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
  const { addReceipt, userProfile, saveProfile, currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const cameraRef = reactExports.useRef(null);
  const galleryRef = reactExports.useRef(null);
  const [queue, setQueue] = reactExports.useState([]);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [dailyCount, setDailyCount] = reactExports.useState(0);
  const [limitChecked, setLimitChecked] = reactExports.useState(false);
  const [showUploadAdGate, setShowUploadAdGate] = reactExports.useState(false);
  const [adGateQueue, setAdGateQueue] = reactExports.useState(0);
  const [currentAd, setCurrentAd] = reactExports.useState(0);
  const [pendingFileQueue, setPendingFileQueue] = reactExports.useState([]);
  reactExports.useEffect(() => {
    getDailyCount(TODAY).then((count) => {
      setDailyCount(count);
      setLimitChecked(true);
    }).catch(() => setLimitChecked(true));
  }, []);
  const isAdmin = userProfile ? isAdminUser(userProfile) : false;
  const isPremium = userProfile ? hasPremiumAccess(userProfile) : false;
  const betaActive = isBetaPeriodActive();
  const limitReached = !isPremium && limitChecked && dailyCount >= FREE_DAILY_LIMIT;
  const canUpload = isPremium || !limitChecked || limitChecked && dailyCount < FREE_DAILY_LIMIT;
  const slotsLeft = Math.max(0, FREE_DAILY_LIMIT - dailyCount);
  const shouldShowAds = !betaActive && !isPremium && !isAdmin;
  userProfile ? getAllowedUploadCount(userProfile) : FREE_DAILY_LIMIT;
  const totalUploaded = getTotalUploads();
  const uploadAdNeeded = userProfile && shouldShowAds ? needsAdForUpload(userProfile, totalUploaded) : false;
  const activeItem = queue[activeIndex] ?? null;
  const processFile = reactExports.useCallback(async (itemId, file) => {
    setQueue(
      (prev) => prev.map((q) => q.id === itemId ? { ...q, status: "processing" } : q)
    );
    try {
      const processedDataUrl = await processImage(file);
      setQueue(
        (prev) => prev.map(
          (q) => q.id === itemId ? {
            ...q,
            previewUrl: processedDataUrl,
            imageDataUrl: processedDataUrl
          } : q
        )
      );
      const text = await extractTextFromImage(processedDataUrl);
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
        return;
      }
      if (shouldShowAds && uploadAdNeeded) {
        setPendingFileQueue(files);
        setAdGateQueue(2);
        setCurrentAd(1);
        setShowUploadAdGate(true);
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
    [canUpload, queue.length, processFile, shouldShowAds, uploadAdNeeded]
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
        const imageData = item.imageDataUrl ?? await (async () => {
          try {
            return await processImage(item.file);
          } catch {
            return await new Promise((resolve, reject) => {
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
          }
        })();
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
        incrementTotalUploads();
        incrementUploadCount();
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
      navigate({ to: "/gallery" });
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
      setShowUploadAdGate(false);
      if (userProfile) {
        const updated = {
          ...userProfile,
          adWatchCount: (userProfile.adWatchCount ?? 0) + 2,
          adUnlockedUploads: (userProfile.adUnlockedUploads ?? 0) + 1,
          lastAdWatchTime: Date.now()
        };
        saveProfile(updated);
      }
      if (pendingFileQueue.length > 0) {
        const files = pendingFileQueue;
        setPendingFileQueue([]);
        const remaining2 = MAX_QUEUE - queue.length;
        const toAdd = files.slice(0, remaining2).filter((f) => f.type.startsWith("image/"));
        if (toAdd.length > 0) {
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
          ue.success(tLang("ad_unlocked_message", lang));
        }
      }
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
        isOpen: showUploadAdGate,
        onComplete: handleAdComplete,
        adNumber: currentAd,
        totalAds: 2,
        context: "upload"
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
                  children: "✂️ Optimised"
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

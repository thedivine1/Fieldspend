import { c as createLucideIcon, _ as __vitePreload, u as useNavigate, a as useAppStore, r as reactExports, d as addReceipt, j as jsxRuntimeExports, I as Image$1, C as Camera, t as tLang, X } from "./index-sLtUKWe7.js";
import { B as Button, f as Badge } from "./index-CEbyqI8d.js";
import { L as Label, I as Input } from "./label-NC-BDMHE.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-d716xdjI.js";
import { T as Textarea } from "./textarea-C5UDe0OM.js";
import { m as motion } from "./proxy-DD_kan0r.js";
import { A as AnimatePresence } from "./index-OcH-pJzN.js";
import { C as CircleCheck } from "./circle-check-BnbIXqjx.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$1);
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
const OCR_SPACE_KEY = "K85312013688957";
const OCR_SPACE_KEY_FALLBACK = "helloworld";
async function extractWithOcrSpace(source, apiKey = OCR_SPACE_KEY) {
  let dataUrl;
  if (typeof source === "string") {
    dataUrl = source.startsWith("data:") ? source : `data:image/jpeg;base64,${source}`;
  } else {
    dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(source);
    });
  }
  const tryEngine = async (engine) => {
    var _a, _b;
    const body = new FormData();
    body.append("base64Image", dataUrl);
    body.append("apikey", apiKey);
    body.append("language", "eng");
    body.append("OCREngine", String(engine));
    body.append("isOverlayRequired", "false");
    body.append("isTable", "false");
    body.append("detectOrientation", "true");
    body.append("scale", "true");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3e4);
    let response;
    try {
      response = await fetch(OCR_SPACE_URL, {
        method: "POST",
        body,
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (!response.ok) throw new Error(`OCR.Space HTTP ${response.status}`);
    const json = await response.json();
    if (json.IsErroredOnProcessing)
      throw new Error("OCR.Space processing error");
    return ((_b = (_a = json.ParsedResults) == null ? void 0 : _a[0]) == null ? void 0 : _b.ParsedText) ?? "";
  };
  let text = "";
  try {
    text = await tryEngine(2);
  } catch {
  }
  if (!text.trim()) {
    try {
      text = await tryEngine(1);
    } catch {
    }
  }
  if (!text.trim() && apiKey === OCR_SPACE_KEY) {
    return extractWithOcrSpace(source, OCR_SPACE_KEY_FALLBACK);
  }
  return text;
}
async function extractTextFromImage(source) {
  try {
    const text = await extractWithOcrSpace(source);
    if (text.trim()) return text;
  } catch {
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
  सितंबर: 9,
  सितम्बर: 9,
  अक्तूबर: 10,
  अक्टूबर: 10,
  नवंबर: 11,
  नवम्बर: 11,
  दिसंबर: 12,
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
function detectDate(text) {
  const normalised = text.replace(
    /(?:journey\s+date|travel\s+date|date\s+of\s+journey|booking\s+date|dt|date|दिनांक|dated)\s*[:\-\.\s]\s*/gi,
    " "
  ).replace(/\r/g, " ").trim();
  function isValidDMY(d, m, y) {
    return d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2e3 && y <= 2035;
  }
  function padDate(n) {
    return String(n).padStart(2, "0");
  }
  function toISO(d, m, y) {
    return `${y}-${padDate(m)}-${padDate(d)}`;
  }
  function resolveYear(short) {
    return short < 50 ? 2e3 + short : 1900 + short;
  }
  const railwayRe = /\b(\d{1,2})[\-](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\-](\d{2})\b/gi;
  for (const m of normalised.matchAll(railwayRe)) {
    const d = Number.parseInt(m[1]);
    const mo = ENGLISH_MONTHS[m[2].toLowerCase()];
    const y = resolveYear(Number.parseInt(m[3]));
    if (mo && isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }
  const dmyRe = /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})\b/g;
  for (const m of normalised.matchAll(dmyRe)) {
    const d = Number.parseInt(m[1]);
    const mo = Number.parseInt(m[2]);
    const y = Number.parseInt(m[3]);
    if (isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }
  const isoRe = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
  for (const m of normalised.matchAll(isoRe)) {
    const y = Number.parseInt(m[1]);
    const mo = Number.parseInt(m[2]);
    const d = Number.parseInt(m[3]);
    if (isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }
  const ddMonYYYY = /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*,?\s*(\d{4})\b/gi;
  for (const m of normalised.matchAll(ddMonYYYY)) {
    const d = Number.parseInt(m[1]);
    const mo = ENGLISH_MONTHS[m[2].toLowerCase()];
    const y = Number.parseInt(m[3]);
    if (mo && isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }
  const monDDYYYY = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s*(\d{4})\b/gi;
  for (const m of normalised.matchAll(monDDYYYY)) {
    const mo = ENGLISH_MONTHS[m[1].toLowerCase()];
    const d = Number.parseInt(m[2]);
    const y = Number.parseInt(m[3]);
    if (mo && isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }
  const dmyShortRe = /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2})\b/g;
  for (const m of normalised.matchAll(dmyShortRe)) {
    const d = Number.parseInt(m[1]);
    const mo = Number.parseInt(m[2]);
    const y = resolveYear(Number.parseInt(m[3]));
    if (isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }
  for (const [monthName, monthNum] of Object.entries(HINDI_MONTHS)) {
    const re = new RegExp(`(\\d{1,2})\\s+${monthName}\\s+(\\d{4})`);
    const match = normalised.match(re);
    if (match) {
      const d = Number.parseInt(match[1]);
      const y = Number.parseInt(match[2]);
      if (isValidDMY(d, monthNum, y)) return toISO(d, monthNum, y);
    }
  }
  return null;
}
const CATEGORY_KEYWORDS = {
  // auto rickshaw — checked first vs cab to avoid "auto" in URL strings
  auto: [
    "auto rickshaw",
    "autorickshaw",
    "auto rik",
    "3 wheeler",
    "three wheeler",
    "auto"
  ],
  // cab / taxi
  cab: [
    "uber eats",
    // listed above plain 'uber' to avoid wrong meal match — handled by auto ordering
    "uber",
    "ola cabs",
    "ola",
    "rapido",
    "meru",
    "savaari",
    "taxiforsure",
    "swift dzire",
    "sedan",
    "hatchback",
    "taxi",
    "cab"
  ],
  // local city bus
  localBus: [
    "local bus",
    "city bus",
    "st bus",
    "msrtc",
    "bmtc",
    "best bus",
    "amts",
    "pmpml",
    "brts",
    "apsrtc",
    "volvo bus",
    "kadam"
  ],
  // inter-city / state bus
  bus: [
    "gsrtc",
    "ksrtc",
    "redbus",
    "state transport",
    "roadways",
    "volvo",
    "travels",
    "bus"
  ],
  // train / railway
  train: [
    "irctc",
    "indian railways",
    "railway",
    "train",
    "express",
    "superfast",
    "shatabdi",
    "rajdhani",
    "duronto",
    "mail",
    "passenger train",
    "reservation",
    "pnr",
    "berth",
    "sleeper",
    "platform",
    "station",
    "rail"
  ],
  // flight / airline
  flight: [
    "boarding pass",
    "air india",
    "airindia",
    "indigo",
    "spicejet",
    "vistara",
    "goair",
    "akasa",
    "airasia",
    "go first",
    "airline",
    "airways",
    "airport",
    "departure",
    "arrival",
    "flight"
  ],
  // hotel / accommodation
  hotel: [
    "guest house",
    "guesthouse",
    "fab hotel",
    "fabhotel",
    "itc hotel",
    "marriott",
    "hyatt",
    "treebo",
    "oyo",
    "hotel",
    "lodge",
    "inn",
    "resort",
    "hostel",
    "taj",
    "room",
    "accommodation",
    "stay"
  ],
  // meal / food
  meal: [
    "restaurant",
    "swiggy",
    "zomato",
    "dhaba",
    "biryani",
    "pizza",
    "burger",
    "coffee",
    "tea stall",
    "bakery",
    "dabba",
    "thali",
    "cafe",
    "food",
    "meal",
    "lunch",
    "dinner",
    "breakfast",
    "snack",
    "chai",
    "tea"
  ]
};
function detectCategory(text) {
  const lower = text.toLowerCase();
  const orderedCategories = [
    "auto",
    "cab",
    "localBus",
    "train",
    "flight",
    "hotel",
    "bus",
    "meal"
  ];
  for (const cat of orderedCategories) {
    const keywords = CATEGORY_KEYWORDS[cat];
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) return cat;
    }
  }
  return null;
}
function detectAmount(text) {
  const candidates = [];
  function extractNum(raw) {
    const cleaned = raw.replace(/,/g, "").trim();
    const val = Number.parseFloat(cleaned);
    return Number.isNaN(val) || val <= 0 ? null : val;
  }
  const highLabels = /(?:grand\s+total|total\s+fare|ticket\s+fare|net\s+payable|total\s+amount|amount\s+due|amount\s+payable|net\s+amount|net\s+total|amount\s+paid|payable|subtotal|fare)\s*[:\-]?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(highLabels)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 10 });
  }
  const totalLabel = /\btotal\b\s*[:\-]?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(totalLabel)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 6 });
  }
  const currencyPfx = /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(currencyPfx)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 4 });
  }
  const labeledNoCurrency = /(?:amount|payable|net|bill|charge)\s*[:\-]?\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(labeledNoCurrency)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 2 });
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score || b.amount - a.amount);
  return candidates[0].amount;
}
const DRAFT_KEY = "fieldspend_receipts";
function saveDraft(queue) {
  try {
    const saveable = queue.filter((q) => q.imageDataUrl !== null).map(
      ({ file: _file, previewUrl: _prev, ...rest }) => ({
        ...rest,
        previewUrl: rest.imageDataUrl
      })
    );
    if (saveable.length === 0) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const payload = {
      items: saveable,
      savedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
  }
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && Array.isArray(data.items) && data.items.length > 0) return data;
  } catch {
  }
  return null;
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
  }
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
  auto: "🛵",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📋"
};
const MAX_QUEUE = 20;
const TODAY = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function QueueItemCard({
  item,
  index,
  isActive,
  showSaved,
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
            item.amount ? ` ₹${item.amount}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
          showSaved && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-secondary flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
            " Saved"
          ] }),
          item.status === "processing" && !showSaved && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "text-primary animate-spin" }),
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
  const { addReceipt: addReceipt$1, currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const cameraRef = reactExports.useRef(null);
  const galleryRef = reactExports.useRef(null);
  const [queue, setQueue] = reactExports.useState([]);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [draftBanner, setDraftBanner] = reactExports.useState(null);
  const [showSaved, setShowSaved] = reactExports.useState({});
  const queueRef = reactExports.useRef(queue);
  reactExports.useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  reactExports.useEffect(() => {
    saveDraft(queue);
  }, [queue]);
  reactExports.useEffect(() => {
    const data = loadDraft();
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return;
    const restored = data.items.map(
      (d) => ({
        ...d,
        file: new File([], d.id),
        previewUrl: d.imageDataUrl,
        status: "done"
      })
    );
    setQueue(restored);
    setActiveIndex(0);
    setDraftBanner(restored.length);
    setTimeout(() => setDraftBanner(null), 3e3);
  }, []);
  reactExports.useEffect(() => {
    const handleBeforeUnload = () => {
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
  const markSaved = reactExports.useCallback((id) => {
    setShowSaved((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setShowSaved((prev) => ({ ...prev, [id]: false }));
    }, 2e3);
  }, []);
  const activeItem = queue[activeIndex] ?? null;
  const saveOneReceipt = reactExports.useCallback(
    async (itemId) => {
      try {
        const current = queueRef.current.find((q) => q.id === itemId);
        if (!current) return;
        const imageData = current.imageDataUrl ?? await (async () => {
          try {
            return await processImage(current.file);
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
              reader.readAsDataURL(current.file);
            });
          }
        })();
        const receipt = {
          id: generateId(),
          imageData,
          date: current.date,
          category: current.category,
          amount: current.amount ? Number.parseFloat(current.amount) : void 0,
          notes: current.notes || void 0,
          createdAt: Date.now()
        };
        await addReceipt(receipt);
        try {
          addReceipt$1(receipt);
        } catch {
        }
        saveDraft(queueRef.current);
        markSaved(itemId);
      } catch {
      }
    },
    [addReceipt$1, markSaved]
  );
  const processFile = reactExports.useCallback(
    async (itemId, file) => {
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
              status: "done",
              ocrAttempted: true,
              ocrFailed: false,
              date: detectedDate ?? q.date,
              category: detectedCategory ?? q.category,
              amount: detectedAmount != null ? String(detectedAmount) : q.amount
            } : q
          )
        );
        saveOneReceipt(itemId);
      } catch {
        setQueue(
          (prev) => prev.map(
            (q) => q.id === itemId ? { ...q, status: "pending", ocrAttempted: true, ocrFailed: true } : q
          )
        );
        saveOneReceipt(itemId);
      }
    },
    [saveOneReceipt]
  );
  const enqueueFiles = reactExports.useCallback(
    (files) => {
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
    [queue.length, processFile]
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
  async function handleSaveAndGo() {
    const unsaved = queue.filter(
      (q) => !showSaved[q.id] && q.status !== "processing"
    );
    if (unsaved.length > 0) {
      await Promise.allSettled(unsaved.map((item) => saveOneReceipt(item.id)));
    }
    clearDraft();
    navigate({ to: "/gallery" });
  }
  const isProcessing = queue.some((q) => q.status === "processing");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", "data-ocid": "upload.page", children: [
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
      queue.length < MAX_QUEUE && /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: draftBanner !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        className: "flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm",
        "data-ocid": "upload.draft_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
            tLang("draftRestored", lang),
            " —",
            " ",
            tLang("draftReceipts", lang).replace(
              "{count}",
              String(draftBanner)
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-muted-foreground hover:text-destructive transition-colors flex-shrink-0",
              onClick: () => {
                clearDraft();
                setQueue([]);
                setActiveIndex(0);
                setDraftBanner(null);
              },
              "data-ocid": "upload.draft_discard_button",
              children: tLang("draftDiscard", lang)
            }
          )
        ]
      }
    ) }),
    queue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-secondary font-medium", children: [
        Object.values(showSaved).filter(Boolean).length,
        "/",
        queue.length,
        " ",
        "saved"
      ] }),
      isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 11, className: "animate-spin" }),
        " Reading receipts…"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "upload.queue_list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: queue.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      QueueItemCard,
      {
        item,
        index: i,
        isActive: i === activeIndex,
        showSaved: !!showSaved[item.id],
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 28, className: "text-primary animate-spin" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: tLang("status.processing", lang) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Reading receipt with OCR…" })
                ]
              }
            ),
            showSaved[activeItem.id] && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { scale: 0 },
                animate: { scale: 1 },
                className: "absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium shadow-md",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
                  " Saved"
                ]
              }
            ),
            activeItem.imageDataUrl && !activeItem.ocrFailed && activeItem.ocrAttempted && !showSaved[activeItem.id] && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0 },
                animate: { scale: 1 },
                className: "absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 text-foreground text-xs font-medium shadow",
                children: "✂️ Optimised"
              }
            ),
            activeItem.ocrAttempted && !activeItem.ocrFailed && activeItem.status === "done" && !showSaved[activeItem.id] && /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
            ] }),
            activeItem.status !== "processing" && !showSaved[activeItem.id] && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "w-full gap-2 border-secondary/40 text-secondary",
                onClick: () => saveOneReceipt(activeItem.id),
                "data-ocid": "upload.save_one_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }),
                  "Save this receipt"
                ]
              }
            )
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
          onClick: handleSaveAndGo,
          disabled: isProcessing,
          "data-ocid": "upload.save_button",
          children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 18, className: "animate-spin" }),
            "Reading receipts…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
            "Save & View Gallery"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          className: "w-full text-muted-foreground",
          onClick: () => {
            clearDraft();
            navigate({ to: "/gallery" });
          },
          "data-ocid": "upload.discard_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14, className: "mr-1.5" }),
            "Discard all"
          ]
        }
      )
    ] })
  ] });
}
export {
  UploadPage as default
};

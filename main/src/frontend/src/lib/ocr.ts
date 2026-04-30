import type { Category } from "@/types";

// ─── Orientation / Portrait Enforcement ───────────────────────────────────────

/**
 * Checks if the image is landscape (width > height).
 * If so, rotates it 90° clockwise on a canvas and returns the corrected
 * base64 data URL. Otherwise returns null (no rotation needed).
 */
export async function enforcePortraitOrientation(
  file: File,
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const { naturalWidth: w, naturalHeight: h } = img;

      // Already portrait (or square) — no rotation needed
      if (h >= w) {
        resolve(null);
        return;
      }

      // Rotate 90° clockwise: canvas width = original height, canvas height = original width
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

/**
 * Converts a base64 data URL back into a File object so Tesseract can consume it.
 */
function dataUrlToFile(dataUrl: string, fileName: string): File {
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

/**
 * Converts a File to a base64 string (without the data URL prefix).
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Tesseract Singleton Worker ───────────────────────────────────────────────

type TesseractWorker = Awaited<
  ReturnType<typeof import("tesseract.js").createWorker>
>;

let workerInstance: TesseractWorker | null = null;
let workerInitPromise: Promise<TesseractWorker> | null = null;

async function getTesseractWorker(): Promise<TesseractWorker> {
  if (workerInstance) return workerInstance;

  if (workerInitPromise) return workerInitPromise;

  workerInitPromise = (async () => {
    const { createWorker } = await import("tesseract.js");
    // 'hin' covers Hindi (Devanagari) which also handles Marathi script
    const worker = await createWorker(["eng", "hin"]);
    workerInstance = worker;
    return worker;
  })();

  return workerInitPromise;
}

// ─── PRIMARY: Tesseract.js (offline, no API) ──────────────────────────────────

async function extractWithTesseract(source: File | string): Promise<string> {
  const worker = await getTesseractWorker();
  const input =
    typeof source === "string" ? dataUrlToFile(source, "receipt.jpg") : source;
  const { data } = await worker.recognize(input);
  return data.text;
}

// ─── FALLBACK: OCR.Space API ──────────────────────────────────────────────────

const OCR_SPACE_URL = "https://api.ocr.space/parse/image";
const OCR_SPACE_KEY = "helloworld";

interface OcrSpaceResult {
  ParsedResults?: Array<{ ParsedText?: string }>;
  IsErroredOnProcessing?: boolean;
}

async function extractWithOcrSpace(source: File | string): Promise<string> {
  let base64: string;
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
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(OCR_SPACE_URL, {
    method: "POST",
    body,
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (!response.ok) throw new Error(`OCR.Space HTTP ${response.status}`);

  const json: OcrSpaceResult = await response.json();
  if (json.IsErroredOnProcessing) throw new Error("OCR.Space processing error");

  const text = json.ParsedResults?.[0]?.ParsedText ?? "";
  if (!text.trim()) throw new Error("OCR.Space returned empty text");

  return text;
}

// ─── Text Extraction (Primary: Tesseract → Fallback: OCR.Space) ──────────────

export async function extractTextFromImage(
  source: File | string,
): Promise<string> {
  // Tesseract.js is primary — offline, instant, no API quota
  try {
    const text = await extractWithTesseract(source);
    if (text.trim()) return text;
  } catch {
    // silent — try fallback
  }

  // OCR.Space as secondary fallback
  try {
    return await extractWithOcrSpace(source);
  } catch {
    return "";
  }
}

// ─── Date Detection ───────────────────────────────────────────────────────────

const HINDI_MONTHS: Record<string, number> = {
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
  दिसम्बर: 12,
};

const ENGLISH_MONTHS: Record<string, number> = {
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
  dec: 12,
};

function padDate(n: number): string {
  return String(n).padStart(2, "0");
}

function toISODate(day: number, month: number, year: number): string {
  return `${year}-${padDate(month)}-${padDate(day)}`;
}

export function detectDate(text: string): string | null {
  // Strip date-label prefixes so the regex hits the value regardless of label
  const normalised = text
    .replace(/(?:date|दिनांक|dated)\s*[:\-]\s*/gi, "")
    .trim();

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = normalised.match(
    /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/,
  );
  if (dmyMatch) {
    const d = Number.parseInt(dmyMatch[1]);
    const m = Number.parseInt(dmyMatch[2]);
    const y = Number.parseInt(dmyMatch[3]);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) return toISODate(d, m, y);
  }

  // YYYY-MM-DD (ISO)
  const isoMatch = normalised.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    const y = Number.parseInt(isoMatch[1]);
    const m = Number.parseInt(isoMatch[2]);
    const d = Number.parseInt(isoMatch[3]);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) return toISODate(d, m, y);
  }

  // DD Month YYYY (English)
  const engMonthMatch = normalised.match(
    /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})\b/i,
  );
  if (engMonthMatch) {
    const d = Number.parseInt(engMonthMatch[1]);
    const m = ENGLISH_MONTHS[engMonthMatch[2].toLowerCase()];
    const y = Number.parseInt(engMonthMatch[3]);
    if (m) return toISODate(d, m, y);
  }

  // Month DD, YYYY (US format)
  const usMonthMatch = normalised.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2}),?\s+(\d{4})\b/i,
  );
  if (usMonthMatch) {
    const m = ENGLISH_MONTHS[usMonthMatch[1].toLowerCase()];
    const d = Number.parseInt(usMonthMatch[2]);
    const y = Number.parseInt(usMonthMatch[3]);
    if (m) return toISODate(d, m, y);
  }

  // DD Hindi-Month YYYY
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

// ─── Category Detection ───────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  cab: ["uber", "ola", "rapido", "namma yatri", "taxi", "cab"],
  auto: ["auto rickshaw", "autorickshaw", "rikshaw", "three wheeler", "auto"],
  localBus: [
    "local bus",
    "city bus",
    "brts",
    "pmpml",
    "bmtc",
    "best bus",
    "amts",
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
    "flight",
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
    "express",
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
    "roadways",
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
    "room",
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
    "biryani",
  ],
  other: [],
};

export function detectCategory(text: string): Category | null {
  const lower = text.toLowerCase();

  // Check multi-word keywords first (more specific) before single-word ones
  const orderedCategories: Category[] = [
    "localBus",
    "train",
    "flight",
    "hotel",
    "cab",
    "auto",
    "bus",
    "meal",
  ];

  for (const cat of orderedCategories) {
    const keywords = CATEGORY_KEYWORDS[cat];
    for (const kw of keywords) {
      if (lower.includes(kw)) return cat;
    }
  }

  return null;
}

// ─── Amount Detection ─────────────────────────────────────────────────────────

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "").trim();
  const val = Number.parseFloat(cleaned);
  return Number.isNaN(val) || val <= 0 ? null : val;
}

export function detectAmount(text: string): number | null {
  const AMOUNT_NUM = /[\d]{1,3}(?:,\d{3})*(?:\.\d{0,2})?/;

  // 1. High-confidence total labels
  const highConfidencePattern = new RegExp(
    `(?:grand\\s+total|net\\s+payable|total\\s+amount|amount\\s+due|net\\s+total|subtotal)\\s*[:\\-]?\\s*(?:₹|rs\\.?|inr)?\\s*(${AMOUNT_NUM.source})`,
    "i",
  );
  const highMatch = text.match(highConfidencePattern);
  if (highMatch) {
    const val = parseAmount(highMatch[1]);
    if (val) return val;
  }

  // 2. Currency-prefixed amounts — return the largest (usually the total)
  const currencyPattern = new RegExp(
    `(?:₹|rs\\.?|inr)\\s*(${AMOUNT_NUM.source})`,
    "gi",
  );
  const currencyMatches = [...text.matchAll(currencyPattern)];
  if (currencyMatches.length > 0) {
    const amounts = currencyMatches
      .map((m) => parseAmount(m[1]))
      .filter((v): v is number => v !== null);
    if (amounts.length > 0) return Math.max(...amounts);
  }

  // 3. Labelled amounts without currency symbol
  const labelledPattern = new RegExp(
    `(?:total|amount|payable|net|bill|charge)\\s*[:\\-]?\\s*(${AMOUNT_NUM.source})`,
    "i",
  );
  const labelledMatch = text.match(labelledPattern);
  if (labelledMatch) {
    const val = parseAmount(labelledMatch[1]);
    if (val) return val;
  }

  return null;
}

// ─── Main Export: extractOCRData ──────────────────────────────────────────────

/**
 * Primary entry point for OCR processing.
 * Accepts a base64 data URL or File.
 * Runs Tesseract.js (offline) first, falls back to OCR.Space silently.
 * All errors are caught — returns {} on failure.
 */
export async function extractOCRData(
  imageData: string | File,
): Promise<{ date?: string; amount?: number; category?: Category }> {
  try {
    const text = await extractTextFromImage(imageData);
    if (!text.trim()) return {};

    const date = detectDate(text) ?? undefined;
    const amount = detectAmount(text) ?? undefined;
    const category = detectCategory(text) ?? undefined;

    return { date, amount, category };
  } catch {
    return {};
  }
}

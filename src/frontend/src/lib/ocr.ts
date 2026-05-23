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

// ─── Warm-up export (call on page mount to pre-download Tesseract models) ────

/**
 * Fire-and-forget: starts loading the Tesseract worker + language models in the
 * background as soon as the Upload page mounts, so the offline fallback is ready
 * by the time the user finishes picking photos.
 */
export function prewarmOcrWorker(): void {
  getTesseractWorker().catch(() => {
    /* silent — pre-warm is best-effort */
  });
}

// ─── PRIMARY: Tesseract.js (offline, no API) ─────────────────────────────────

async function extractWithTesseract(source: File | string): Promise<string> {
  const worker = await getTesseractWorker();
  const input =
    typeof source === "string" ? dataUrlToFile(source, "receipt.jpg") : source;
  const { data } = await worker.recognize(input);
  return data.text;
}

// ─── FALLBACK: OCR.Space API ─────────────────────────────────────────────────

const OCR_SPACE_URL = "https://api.ocr.space/parse/image";
// Free-tier key. Falls back to the public demo key if daily quota is exceeded.
const OCR_SPACE_KEY = "K85312013688957";
const OCR_SPACE_KEY_FALLBACK = "helloworld";

interface OcrSpaceResult {
  ParsedResults?: Array<{ ParsedText?: string }>;
  IsErroredOnProcessing?: boolean;
}

/**
 * Compresses a data URL image to a smaller size specifically for OCR API calls.
 *
 * The free OCR.Space plan has a hard 1 024 KB payload limit.
 * Base64 encoding adds ~33 % overhead, so a raw file must stay under ~750 KB.
 * We scale the image to max 800 px on the longest side at JPEG 0.72 quality,
 * which keeps typical receipt photos well under 400 KB as base64.
 */
async function compressForOcr(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const MAX_PX = 800;
          const scale = Math.min(
            MAX_PX / Math.max(img.width, img.height),
            1,
          );
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}

async function extractWithOcrSpace(
  source: File | string,
  apiKey = OCR_SPACE_KEY,
): Promise<string> {
  // Build data URL from File if needed
  let dataUrl: string;

  if (typeof source === "string") {
    dataUrl = source.startsWith("data:")
      ? source
      : `data:image/jpeg;base64,${source}`;
  } else {
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(source);
    });
  }

  // *** KEY FIX: Compress to a small size BEFORE sending so we stay under the
  // 1 024 KB free-tier limit. This also speeds up the request significantly.
  const smallDataUrl = await compressForOcr(dataUrl);

  const tryEngine = async (engine: number): Promise<string> => {
    const body = new FormData();
    body.append("base64Image", smallDataUrl);
    body.append("apikey", apiKey);
    body.append("language", "eng");
    body.append("OCREngine", String(engine));
    body.append("isOverlayRequired", "false");
    body.append("isTable", "false");
    body.append("detectOrientation", "true");
    body.append("scale", "true");

    // 25 s timeout — generous but not blocking
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let response: Response;
    try {
      response = await fetch(OCR_SPACE_URL, {
        method: "POST",
        body,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) throw new Error(`OCR.Space HTTP ${response.status}`);

    const json: OcrSpaceResult = await response.json();
    if (json.IsErroredOnProcessing)
      throw new Error("OCR.Space processing error");

    return json.ParsedResults?.[0]?.ParsedText ?? "";
  };

  // *** KEY FIX: Engine 1 first — it works on the free plan.
  // Engine 2 is tried as a second pass (it may work if the key has credits).
  let text = "";
  try {
    text = await tryEngine(1);
  } catch {
    // silent
  }

  // Engine 2 as a second attempt if Engine 1 returned nothing
  if (!text.trim()) {
    try {
      text = await tryEngine(2);
    } catch {
      // silent
    }
  }

  // If quota exceeded on primary key, retry with public demo key
  if (!text.trim() && apiKey === OCR_SPACE_KEY) {
    return extractWithOcrSpace(source, OCR_SPACE_KEY_FALLBACK);
  }

  return text;
}

// ─── Text Extraction (Primary: OCR.Space → Fallback: Tesseract.js) ──────────

export async function extractTextFromImage(
  source: File | string,
): Promise<string> {
  // OCR.Space is primary — better accuracy on Indian receipts, mixed scripts
  try {
    const text = await extractWithOcrSpace(source);
    if (text.trim()) return text;
  } catch {
    // silent — try fallback
  }

  // Tesseract.js as offline fallback
  try {
    return await extractWithTesseract(source);
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
  सितंबर: 9,
  सितम्बर: 9,
  अक्तूबर: 10,
  अक्टूबर: 10,
  नवंबर: 11,
  नवम्बर: 11,
  दिसंबर: 12,
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

export function detectDate(text: string): string | null {
  // Normalise: strip common label prefixes
  const normalised = text
    .replace(
      /(?:journey\s+date|travel\s+date|date\s+of\s+journey|booking\s+date|dt|date|दिनांक|dated)\s*[:\-\.\s]\s*/gi,
      " ",
    )
    .replace(/\r/g, " ")
    .trim();

  function isValidDMY(d: number, m: number, y: number): boolean {
    return d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2000 && y <= 2035;
  }

  function padDate(n: number): string {
    return String(n).padStart(2, "0");
  }

  function toISO(d: number, m: number, y: number): string {
    return `${y}-${padDate(m)}-${padDate(d)}`;
  }

  function resolveYear(short: number): number {
    return short < 50 ? 2000 + short : 1900 + short;
  }

  // --- Pattern 1: Railway short year DD-MMM-YY e.g. 12-May-26 ---
  const railwayRe =
    /\b(\d{1,2})[\-](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\-](\d{2})\b/gi;
  for (const m of normalised.matchAll(railwayRe)) {
    const d = Number.parseInt(m[1]);
    const mo = ENGLISH_MONTHS[m[2].toLowerCase()];
    const y = resolveYear(Number.parseInt(m[3]));
    if (mo && isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }

  // --- Pattern 2: DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY (with optional spaces) ---
  const dmyRe = /\b(\d{1,2})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{4})\b/g;
  for (const m of normalised.matchAll(dmyRe)) {
    const d = Number.parseInt(m[1]);
    const mo = Number.parseInt(m[2]);
    const y = Number.parseInt(m[3]);
    if (isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }

  // --- Pattern 3: YYYY-MM-DD (ISO or space separated) ---
  const isoRe = /\b(\d{4})\s*[-\/.]\s*(\d{2})\s*[-\/.]\s*(\d{2})\b/g;
  for (const m of normalised.matchAll(isoRe)) {
    const y = Number.parseInt(m[1]);
    const mo = Number.parseInt(m[2]);
    const d = Number.parseInt(m[3]);
    if (isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }

  // --- Pattern 4: DD Mon YYYY or DD Month YYYY (e.g. 15 Mar 2026 / 5th March 2026) ---
  const ddMonYYYY =
    /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*,?\s*(\d{4})\b/gi;
  for (const m of normalised.matchAll(ddMonYYYY)) {
    const d = Number.parseInt(m[1]);
    const mo = ENGLISH_MONTHS[m[2].toLowerCase()];
    const y = Number.parseInt(m[3]);
    if (mo && isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }

  // --- Pattern 5: Mon DD, YYYY (US format — e.g. Mar 15, 2026) ---
  const monDDYYYY =
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s*(\d{4})\b/gi;
  for (const m of normalised.matchAll(monDDYYYY)) {
    const mo = ENGLISH_MONTHS[m[1].toLowerCase()];
    const d = Number.parseInt(m[2]);
    const y = Number.parseInt(m[3]);
    if (mo && isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }

  // --- Pattern 6: DD/MM/YY (2-digit year) ---
  const dmyShortRe = /\b(\d{1,2})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{2})\b/g;
  for (const m of normalised.matchAll(dmyShortRe)) {
    const d = Number.parseInt(m[1]);
    const mo = Number.parseInt(m[2]);
    const y = resolveYear(Number.parseInt(m[3]));
    if (isValidDMY(d, mo, y)) return toISO(d, mo, y);
  }

  // --- Pattern 7: Hindi month names ---
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

// ─── Category Detection ───────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<Exclude<Category, "other">, string[]> = {
  // auto rickshaw — checked first vs cab to avoid "auto" in URL strings
  auto: [
    "auto rickshaw",
    "autorickshaw",
    "auto rik",
    "3 wheeler",
    "three wheeler",
    "auto",
  ],
  // cab / taxi
  cab: [
    "uber eats", // listed above plain 'uber' to avoid wrong meal match — handled by auto ordering
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
    "cab",
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
    "kadam",
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
    "bus",
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
    "rail",
    "uts",
    "atvm",
    "journey",
    "jrny",
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
    "flight",
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
    "stay",
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
    "tea",
  ],
  metro: ["metro", "mumbai metro", "delhi metro", "namma metro", "maha metro", "pune metro", "chennai metro", "kochi metro", "lucknow metro", "jaipur metro", "hyderabad metro"],
};

export function detectCategory(text: string): Category | null {
  const lower = text.toLowerCase();

  // Priority order: most-specific multi-word categories first, then single-word
  // auto before cab to catch "auto rickshaw" before bare "auto"
  // localBus before bus to catch specific operators before generic "bus"
  // flight before train (both may mention "express")
  const orderedCategories: Exclude<Category, "other">[] = [
    "auto",
    "cab",
    "localBus",
    "train",
    "metro",
    "flight",
    "hotel",
    "bus",
    "meal",
  ];

  for (const cat of orderedCategories) {
    const keywords = CATEGORY_KEYWORDS[cat];
    for (const kw of keywords) {
      const re = new RegExp(`\\b${kw}\\b`, "i");
      if (re.test(text)) return cat;
    }
  }

  return null;
}

// ─── Amount Detection ─────────────────────────────────────────────────────────

export function detectAmount(text: string): number | null {
  // Collect all candidate amounts, score by label confidence
  const candidates: Array<{ amount: number; score: number }> = [];

  function extractNum(raw: string): number | null {
    const cleaned = raw.replace(/,/g, "").trim();
    const val = Number.parseFloat(cleaned);
    return Number.isNaN(val) || val <= 0 ? null : val;
  }

  // Pattern 1 — Highest-confidence labeled totals (score 10)
  const highLabels =
    /(?:grand\s+total|total\s+fare|ticket\s+fare|net\s+payable|total\s+amount|amount\s+due|amount\s+payable|net\s+amount|net\s+total|amount\s+paid|payable|subtotal|fare)\s*[:\-]?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(highLabels)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 10 });
  }

  // Pattern 2 — Generic "total" label (score 6)
  const totalLabel =
    /\btotal\b\s*[:\-]?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(totalLabel)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 6 });
  }

  // Pattern 3 — Currency-symbol prefixed (₹, Rs, Rs., INR) with optional space (score 4)
  const currencyPfx = /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(currencyPfx)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 4 });
  }

  // Pattern 4 — Labeled amounts without currency (score 2)
  const labeledNoCurrency =
    /(?:amount|payable|net|bill|charge)\s*[:\-]?\s*(?:₹|Rs\.?|INR)?\s*([\d,]+(?:\.\d{1,2})?)/gi;
  for (const m of text.matchAll(labeledNoCurrency)) {
    const v = extractNum(m[1]);
    if (v) candidates.push({ amount: v, score: 2 });
  }

  if (candidates.length === 0) return null;

  // Among all candidates: return the one with the highest score.
  // Ties broken by largest amount (the total, not a line item).
  candidates.sort((a, b) => b.score - a.score || b.amount - a.amount);
  return candidates[0].amount;
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

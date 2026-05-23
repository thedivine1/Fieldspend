// ─── Image Processing Pipeline ────────────────────────────────────────────────
// Full pipeline: EXIF read → rotate → edge detect/crop → resize → compress
// All steps are silent — any failure falls back gracefully.

// ─── Enforce Portrait ──────────────────────────────────────────────────────────

/**
 * Modern browsers automatically apply EXIF rotation to HTMLImageElement.
 * This function simply draws the image, and if it's landscape (width > height),
 * it rotates it 90° CW to force it into portrait mode for easier receipt reading.
 */
function enforcePortrait(img: HTMLImageElement): HTMLCanvasElement {
  const w = img.naturalWidth;
  const h = img.naturalHeight;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }

  if (w > h) {
    // It's landscape, force it to portrait by rotating 90° CW
    canvas.width = h;
    canvas.height = w;
    ctx.translate(h / 2, w / 2);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    // Already portrait or square
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
  }

  return canvas;
}

// ─── Edge Detection & Receipt Crop ────────────────────────────────────────────

interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Converts a canvas to grayscale pixel data.
 */
function toGrayscale(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): Uint8Array {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const gray = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    // Standard luminance weights
    gray[i] =
      data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114;
  }
  return gray;
}

/**
 * Applies a simple Sobel gradient magnitude to find edges.
 * Returns edge magnitude array (0–255 normalised).
 */
function sobelEdges(gray: Uint8Array, w: number, h: number): Uint8Array {
  const edges = new Uint8Array(w * h);
  let maxMag = 0;
  const mags = new Float32Array(w * h);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      // 3×3 Sobel kernels
      const gx =
        -gray[(y - 1) * w + (x - 1)] +
        gray[(y - 1) * w + (x + 1)] +
        -2 * gray[y * w + (x - 1)] +
        2 * gray[y * w + (x + 1)] +
        -gray[(y + 1) * w + (x - 1)] +
        gray[(y + 1) * w + (x + 1)];
      const gy =
        -gray[(y - 1) * w + (x - 1)] +
        -2 * gray[(y - 1) * w + x] +
        -gray[(y - 1) * w + (x + 1)] +
        gray[(y + 1) * w + (x - 1)] +
        2 * gray[(y + 1) * w + x] +
        gray[(y + 1) * w + (x + 1)];
      const mag = Math.sqrt(gx * gx + gy * gy);
      mags[idx] = mag;
      if (mag > maxMag) maxMag = mag;
    }
  }

  if (maxMag > 0) {
    for (let i = 0; i < w * h; i++) {
      edges[i] = (mags[i] / maxMag) * 255;
    }
  }
  return edges;
}

/**
 * Finds the bounding box of high-contrast (edge) regions.
 * Returns null if confidence is too low (likely no distinct receipt boundaries).
 *
 * Strategy:
 *  1. Threshold edges at 30% of max
 *  2. Find min/max x/y of edge pixels
 *  3. Accept only if the region covers 20–95% of width/height
 *     (too small = no receipt found, too large = full image)
 */
function findReceiptBounds(
  edges: Uint8Array,
  w: number,
  h: number,
): BoundingBox | null {
  const THRESHOLD = 76; // 30% of 255

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

  if (edgeCount < 100) return null; // Not enough edge pixels

  const boxW = maxX - minX;
  const boxH = maxY - minY;
  const coverageX = boxW / w;
  const coverageY = boxH / h;

  // Reject if the detected region is too small or fills the whole image
  // (both cases indicate we can't distinguish a distinct receipt)
  if (
    coverageX < 0.2 ||
    coverageY < 0.2 ||
    coverageX > 0.95 ||
    coverageY > 0.95
  ) {
    return null;
  }

  // Add a small padding (2%) around the detected region
  const padX = Math.floor(w * 0.02);
  const padY = Math.floor(h * 0.02);
  return {
    x: Math.max(0, minX - padX),
    y: Math.max(0, minY - padY),
    w: Math.min(w, maxX + padX) - Math.max(0, minX - padX),
    h: Math.min(h, maxY + padY) - Math.max(0, minY - padY),
  };
}

/**
 * Detects receipt bounds using edge detection on a downscaled version of the canvas.
 * Works at 1/4 resolution to stay performant on mobile.
 * Returns a BoundingBox in original canvas coordinates, or null if unconfident.
 */
function detectReceiptBounds(
  sourceCanvas: HTMLCanvasElement,
): BoundingBox | null {
  try {
    const origW = sourceCanvas.width;
    const origH = sourceCanvas.height;

    // Downscale to max 400px wide for performance
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

    // Scale bounds back to original resolution
    return {
      x: Math.floor(bounds.x / scale),
      y: Math.floor(bounds.y / scale),
      w: Math.ceil(bounds.w / scale),
      h: Math.ceil(bounds.h / scale),
    };
  } catch {
    return null;
  }
}

// ─── Crop Canvas ──────────────────────────────────────────────────────────────

function cropCanvas(
  source: HTMLCanvasElement,
  bounds: BoundingBox,
): HTMLCanvasElement {
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
    bounds.h,
  );
  return canvas;
}

// ─── Resize ───────────────────────────────────────────────────────────────────

/**
 * Resizes canvas to max 800px wide, max 1024px tall, maintaining aspect ratio.
 * Never upscales.
 */
function resizeCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const MAX_W = 800;
  const MAX_H = 1024;
  const origW = source.width;
  const origH = source.height;

  if (origW <= MAX_W && origH <= MAX_H) return source; // Already fits, no upscale

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

  // Use imageSmoothingQuality for better downscale results
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, newW, newH);
  return canvas;
}

// ─── Load Image from File ─────────────────────────────────────────────────────

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
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

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Full image processing pipeline for receipts:
 *  1. Load image (browser handles EXIF automatically)
 *  2. Enforce portrait mode (rotate 90° if landscape)
 *  3. Detect receipt bounds via edge detection (Sobel)
 *  4. Crop to receipt bounds (skip if unconfident)
 *  5. Resize to max 800×1024 (no upscale)
 *  6. Compress to JPEG @ 0.85 quality
 *
 * All failures are silent — falls back to the previous best canvas state.
 * Returns a JPEG data URL string.
 */
export async function processImage(file: File): Promise<string> {
  try {
    // Step 1: Load image
    const img = await loadImageFromFile(file);

    // Step 2: Enforce portrait mode
    let canvas = enforcePortrait(img);

    // Step 3+4: Detect receipt bounds and crop (silently skip on failure)
    try {
      const bounds = detectReceiptBounds(canvas);
      if (bounds && bounds.w > 50 && bounds.h > 50) {
        canvas = cropCanvas(canvas, bounds);
      }
    } catch {
      // Silent — skip crop, keep rotated canvas
    }

    // Step 5: Resize to max 800×1024
    canvas = resizeCanvas(canvas);

    // Step 6: Compress to JPEG @ 0.85
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    // Complete fallback — read file as-is
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") resolve(result);
        else reject(new Error("FileReader failed"));
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(file);
    });
  }
}

// ─── Razorpay Checkout Integration ───────────────────────────────────────────
// Dynamically loads Razorpay Checkout JS and exposes a typed open() helper.
// Key ID uses a placeholder — replace with your live rzp_live_XXXXX key.

export const RZP_KEY_ID = "rzp_test_SZoaM8DEsMr4rV";

type RazorpayOptions = {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
};

export type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

// ─── Load script once ─────────────────────────────────────────────────────────

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("razorpay_load_failed"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

// ─── Open Checkout ─────────────────────────────────────────────────────────────

export type PlanType = "monthly" | "annual";

export interface OpenCheckoutParams {
  planType: PlanType;
  orderId: string;
  userName: string;
  userEmail: string;
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss: () => void;
}

export async function openRazorpayCheckout(
  params: OpenCheckoutParams,
): Promise<void> {
  await loadRazorpayScript();

  const { planType, orderId, userName, userEmail, onSuccess, onDismiss } =
    params;
  const isAnnual = planType === "annual";
  const amountPaise = isAnnual ? 58800 : 9900; // ₹588/year or ₹99/month in paise
  const description = isAnnual
    ? "Fieldspend Premium — Annual (₹588/year)"
    : "Fieldspend Premium — Monthly (₹99/month)";

  const options: RazorpayOptions = {
    key: RZP_KEY_ID,
    amount: amountPaise,
    currency: "INR",
    name: "Fieldspend",
    description,
    order_id: orderId,
    prefill: { name: userName, email: userEmail },
    theme: { color: "#2563eb" },
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

// ─── Premium Expiry Calculation ───────────────────────────────────────────────

export function getPremiumExpiry(planType: PlanType): number {
  const now = new Date();
  if (planType === "annual") {
    return new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate(),
    ).getTime();
  }
  return new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  ).getTime();
}

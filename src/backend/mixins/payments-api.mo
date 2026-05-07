import Types "../types/payments";
import PaymentLib "../lib/payments";

// Public Candid API for the payments domain.
// Receives the premium store state slice from main.mo.
mixin (
  premiumStore : PaymentLib.PremiumStore,
  rzKeyId      : Text,
  rzKeySecret  : Text,
) {

  // ── Create Razorpay Order ────────────────────────────────────────

  /// Creates a Razorpay order for the given plan.
  /// Returns order_id and amount on success, error message on failure.
  /// Never traps — returns success:false on any error.
  public shared func createOrder(
    req : Types.CreateOrderRequest
  ) : async Types.CreateOrderResult {
    let (ok, orderId, err) = await PaymentLib.createRazorpayOrder(
      rzKeyId, rzKeySecret, req.planType
    );
    if (ok) {
      {
        success = true;
        orderId;
        amount = PaymentLib.planAmount(req.planType);
        currency = "INR";
        error = null;
      }
    } else {
      {
        success = false;
        orderId = "";
        amount = 0;
        currency = "INR";
        error = err;
      }
    }
  };

  // ── Verify Payment ───────────────────────────────────────────────

  /// Verifies a Razorpay payment callback.
  /// On success, marks the user as premium in stable store.
  /// Never traps — returns success:false on invalid signature or errors.
  public shared func verifyPayment(
    req : Types.VerifyPaymentRequest
  ) : async Types.VerifyPaymentResult {
    let valid = PaymentLib.validateSignature(premiumStore, req);
    if (not valid) {
      return { success = false; error = ?"Invalid payment signature" };
    };
    // Persist premium status
    PaymentLib.setPremiumStatus(
      premiumStore,
      req.email,
      req.planType,
      req.razorpay_order_id,
    );
    { success = true; error = null }
  };

  // ── Get Premium Status ───────────────────────────────────────────

  /// Returns the premium status for a given email.
  /// Admin email always returns isPremium=true with no expiry.
  public shared query func getUserPremiumStatus(
    email : Text
  ) : async Types.PremiumStatusResult {
    PaymentLib.getPremiumStatus(premiumStore, email)
  };
};

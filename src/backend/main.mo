import ExpenseLib "lib/expenses";
import PaymentLib "lib/payments";
import ExpensesMixin "mixins/expenses-api";
import PaymentsMixin "mixins/payments-api";
import Map "mo:core/Map";

actor {
  // Receipts stored per-user: Map<UserId, List<Receipt>>
  let receipts : ExpenseLib.ReceiptStore = Map.empty();
  // User profiles keyed by UserId (Principal)
  let profiles : ExpenseLib.ProfileStore = Map.empty();
  // Premium status keyed by lowercase email
  let premiumStore : PaymentLib.PremiumStore = Map.empty();

  // Razorpay credentials — replace placeholders with real keys before launch
  let rzKeyId     : Text = "rz_key_id";
  let rzKeySecret : Text = "rz_key_secret";

  // Wire the expenses API mixin with both state slices
  include ExpensesMixin(receipts, profiles);
  // Wire the payments API mixin
  include PaymentsMixin(premiumStore, rzKeyId, rzKeySecret);
};

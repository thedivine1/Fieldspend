import ExpenseLib "lib/expenses";
import ExpensesMixin "mixins/expenses-api";
import Map "mo:core/Map";

actor {
  // Receipts stored per-user: Map<UserId, List<Receipt>>
  let receipts : ExpenseLib.ReceiptStore = Map.empty();
  // User profiles keyed by UserId (Principal)
  let profiles : ExpenseLib.ProfileStore = Map.empty();

  // Wire the expenses API mixin with both state slices
  include ExpensesMixin(receipts, profiles);
};

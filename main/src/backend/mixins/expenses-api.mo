import Types "../types/expenses";
import ExpenseLib "../lib/expenses";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

// Public Candid API for the expenses domain.
// Receives the two canonical state slices from main.mo.
mixin (
  receipts : ExpenseLib.ReceiptStore,
  profiles : ExpenseLib.ProfileStore,
) {

  // ── Profile endpoints ────────────────────────────────────────────

  /// Retrieve the caller's user profile; null if first-time user.
  public shared ({ caller }) func getUserProfile() : async ?Types.UserProfile {
    ExpenseLib.getProfile(profiles, caller)
  };

  /// Create or update the caller's user profile.
  /// Forces userId to match the caller — client cannot spoof another user's profile.
  public shared ({ caller }) func updateUserProfile(
    profile : Types.UserProfile
  ) : async () {
    let safe = { profile with userId = caller };
    ExpenseLib.upsertProfile(profiles, safe);
  };

  // ── Expense endpoints ────────────────────────────────────────────

  /// List all receipts belonging to the caller.
  public shared query ({ caller }) func getExpenses() : async [Types.Receipt] {
    ExpenseLib.listReceipts(receipts, caller)
  };

  /// Add a new receipt for the caller; returns the assigned ExpenseId.
  /// Enforces free-tier daily limit for non-premium, non-beta users.
  public shared ({ caller }) func addExpense(
    receipt : Types.Receipt
  ) : async Types.ExpenseId {
    // Enforce daily limit for free-tier users (outside beta)
    let isBeta = switch (ExpenseLib.getProfile(profiles, caller)) {
      case (?p) { ExpenseLib.isInBetaPeriod(p.betaExpiryDate) or p.isPremium };
      case null { false };
    };
    if (not isBeta) {
      let todayCount = ExpenseLib.getDailyCount(receipts, caller, Time.now());
      if (todayCount >= Types.FREE_DAILY_LIMIT) {
        Runtime.trap("Daily upload limit reached. Upgrade to premium for unlimited uploads.");
      };
    };
    ExpenseLib.addReceipt(receipts, caller, receipt)
  };

  /// Update an existing receipt; traps if not found or caller mismatch.
  public shared ({ caller }) func updateExpense(
    receipt : Types.Receipt
  ) : async () {
    let ok = ExpenseLib.updateReceipt(receipts, caller, receipt);
    if (not ok) {
      Runtime.trap("Receipt not found or does not belong to caller");
    };
  };

  /// Delete a receipt; traps if not found or caller mismatch.
  public shared ({ caller }) func deleteExpense(
    id : Types.ExpenseId
  ) : async () {
    let ok = ExpenseLib.deleteReceipt(receipts, caller, id);
    if (not ok) {
      Runtime.trap("Receipt not found or does not belong to caller");
    };
  };

  /// How many receipts the caller has uploaded today (for limit enforcement).
  public shared query ({ caller }) func getDailyCount() : async Nat {
    ExpenseLib.getDailyCount(receipts, caller, Time.now())
  };
};

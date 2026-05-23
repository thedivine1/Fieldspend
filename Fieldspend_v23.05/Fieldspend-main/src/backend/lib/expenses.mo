import Types "../types/expenses";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  // ── State types ──────────────────────────────────────────────────
  // Receipts are stored per-user: Map<UserId, List<Receipt>>
  // This avoids cross-user id collisions and makes user scoping O(log n).
  public type UserReceiptList = List.List<Types.Receipt>;
  public type ReceiptStore = Map.Map<Types.UserId, UserReceiptList>;
  public type ProfileStore = Map.Map<Types.UserId, Types.UserProfile>;

  // ── Private helpers ──────────────────────────────────────────────

  /// Nanoseconds in one day.
  let DAY_NS : Int = 86_400_000_000_000;

  /// Truncate a nanosecond timestamp to the start of its UTC day.
  func dayFloor(ts : Types.Timestamp) : Int {
    ts - (ts % DAY_NS);
  };

  /// Get a user's receipt list (read-only — returns null if absent).
  func getUserListReadOnly(
    store : ReceiptStore,
    userId : Types.UserId,
  ) : ?UserReceiptList {
    store.get(userId)
  };

  /// Get or create a user's receipt list (write path — creates entry if absent).
  func getUserListOrCreate(
    store : ReceiptStore,
    userId : Types.UserId,
  ) : UserReceiptList {
    switch (store.get(userId)) {
      case (?list) { list };
      case null {
        let list = List.empty<Types.Receipt>();
        store.add(userId, list);
        list
      };
    }
  };

  // ── Receipt helpers ──────────────────────────────────────────────

  /// Return all receipts for a given user, sorted newest-first.
  public func listReceipts(
    store : ReceiptStore,
    userId : Types.UserId,
  ) : [Types.Receipt] {
    switch (getUserListReadOnly(store, userId)) {
      case null { [] };
      case (?list) {
        let arr = list.toArray();
        arr.sort(func(a : Types.Receipt, b : Types.Receipt) : { #less; #equal; #greater } {
          if (a.createdAt > b.createdAt) { #less }
          else if (a.createdAt < b.createdAt) { #greater }
          else { #equal }
        })
      };
    }
  };

  /// Return a single receipt by id, scoped to a user.
  public func getReceipt(
    store : ReceiptStore,
    userId : Types.UserId,
    id : Types.ExpenseId,
  ) : ?Types.Receipt {
    switch (getUserListReadOnly(store, userId)) {
      case null { null };
      case (?list) {
        list.find(func(r : Types.Receipt) : Bool { r.id == id })
      };
    }
  };

  /// Persist a new receipt and return the assigned id.
  /// Traps if imageData is empty.
  public func addReceipt(
    store : ReceiptStore,
    userId : Types.UserId,
    receipt : Types.Receipt,
  ) : Types.ExpenseId {
    if (receipt.imageData == "") {
      Runtime.trap("imageData must not be empty");
    };
    let list = getUserListOrCreate(store, userId);
    list.add(receipt);
    receipt.id
  };

  /// Replace a receipt's fields in-place; returns false if not found.
  public func updateReceipt(
    store : ReceiptStore,
    userId : Types.UserId,
    updated : Types.Receipt,
  ) : Bool {
    switch (getUserListReadOnly(store, userId)) {
      case null { false };
      case (?list) {
        var found = false;
        list.mapInPlace(func(r : Types.Receipt) : Types.Receipt {
          if (r.id == updated.id) {
            found := true;
            updated
          } else {
            r
          }
        });
        found
      };
    }
  };

  /// Remove a receipt; returns false if not found.
  public func deleteReceipt(
    store : ReceiptStore,
    userId : Types.UserId,
    id : Types.ExpenseId,
  ) : Bool {
    switch (getUserListReadOnly(store, userId)) {
      case null { false };
      case (?list) {
        let sizeBefore = list.size();
        let kept = list.filter(func(r : Types.Receipt) : Bool { r.id != id });
        list.clear();
        list.append(kept);
        list.size() < sizeBefore
      };
    }
  };

  /// How many receipts has this user uploaded on the day containing todayTimestamp?
  public func getDailyCount(
    store : ReceiptStore,
    userId : Types.UserId,
    todayTimestamp : Types.Timestamp,
  ) : Nat {
    switch (getUserListReadOnly(store, userId)) {
      case null { 0 };
      case (?list) {
        let dayStart = dayFloor(todayTimestamp);
        let dayEnd = dayStart + DAY_NS;
        var count = 0;
        list.forEach(func(r : Types.Receipt) {
          if (r.createdAt >= dayStart and r.createdAt < dayEnd) {
            count += 1;
          };
        });
        count
      };
    }
  };

  // ── Profile helpers ──────────────────────────────────────────────

  /// Retrieve a user profile; returns null if not yet created.
  public func getProfile(
    store : ProfileStore,
    userId : Types.UserId,
  ) : ?Types.UserProfile {
    store.get(userId)
  };

  /// Create or fully replace a user profile.
  public func upsertProfile(
    store : ProfileStore,
    profile : Types.UserProfile,
  ) : () {
    store.add(profile.userId, profile);
  };

  // ── Utility helpers ──────────────────────────────────────────────

  /// Is the current time within the beta period?
  public func isInBetaPeriod(betaExpiryDate : Types.Timestamp) : Bool {
    Time.now() <= betaExpiryDate
  };

  /// Human-readable English label for a category.
  public func getCategoryLabel(cat : Types.Category) : Text {
    switch (cat) {
      case (#cab) { "Cab" };
      case (#train) { "Train" };
      case (#bus) { "Bus" };
      case (#flight) { "Flight" };
      case (#hotel) { "Hotel" };
      case (#meal) { "Meal" };
      case (#other) { "Other" };
    }
  };

  /// Build a category breakdown array from a receipt list.
  public func buildCategoryBreakdown(receipts : [Types.Receipt]) : [Types.CategoryTotal] {
    let categories : [Types.Category] = [#cab, #train, #bus, #flight, #hotel, #meal, #other];
    categories.filterMap<Types.Category, Types.CategoryTotal>(func(cat : Types.Category) : ?Types.CategoryTotal {
      var total : Float = 0.0;
      var count = 0;
      for (r in receipts.values()) {
        if (r.category == cat) {
          count += 1;
          switch (r.amount) {
            case (?amt) { total += amt };
            case null {};
          };
        };
      };
      if (count > 0) {
        ?{ category = cat; totalAmount = total; count }
      } else {
        null
      }
    })
  };
};

import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type ExpenseId = Common.ExpenseId;
  public type UserId = Common.UserId;

  // Receipt category variant
  public type Category = {
    #cab;
    #train;
    #bus;
    #flight;
    #hotel;
    #meal;
    #other;
  };

  // Preferred language for the user's UI
  public type Language = {
    #en;
    #hi;
    #mr;
  };

  // A single expense receipt — imageData is base64-encoded on the client,
  // stored as Text here for cross-platform Candid compatibility.
  public type Receipt = {
    id : ExpenseId;
    imageData : Text; // base64 string
    date : Timestamp; // detected or manually set by user
    category : Category;
    amount : ?Float; // optional — OCR may not detect
    notes : ?Text;
    createdAt : Timestamp;
  };

  // User profile — mirrors what is stored in IndexedDB on the client;
  // backend provides the authoritative copy for future cloud sync.
  public type UserProfile = {
    userId : UserId;
    name : Text;
    companyName : ?Text;
    preferredLanguage : Language;
    isPremium : Bool;
    betaExpiryDate : Timestamp; // 60 days from first use
    dailyUploadCount : Nat;
    lastUploadDate : Timestamp; // date (day resolution) of last upload
  };

  // Category breakdown entry used in expense reports
  public type CategoryTotal = {
    category : Category;
    totalAmount : Float;
    count : Nat;
  };

  // A generated expense report for a given month/year
  public type ExpenseReport = {
    title : Text;
    month : Nat; // 1–12
    year : Nat;
    userId : UserId;
    receipts : [Receipt];
    totalAmount : Float;
    categoryBreakdown : [CategoryTotal]; // flat array; not Map — Map is not shared
  };

  // Constants — exposed as typed values so the frontend can read them
  public let FREE_DAILY_LIMIT : Nat = 10;
  public let BETA_DAYS : Nat = 60;
};

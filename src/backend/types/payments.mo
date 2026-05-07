import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type PlanType = {
    #monthly; // ₹99/month
    #annual;  // ₹588/year (₹49/month)
  };

  // Razorpay order creation request
  public type CreateOrderRequest = {
    planType : PlanType;
  };

  // Razorpay order creation response
  public type CreateOrderResult = {
    success : Bool;
    orderId : Text;   // razorpay order_id, empty on failure
    amount : Nat;     // amount in paise
    currency : Text;
    error : ?Text;    // populated on failure
  };

  // Payment verification request — matches Razorpay's callback payload
  public type VerifyPaymentRequest = {
    razorpay_order_id : Text;
    razorpay_payment_id : Text;
    razorpay_signature : Text;
    email : Text; // user email — used to set premium status
    planType : PlanType;
  };

  public type VerifyPaymentResult = {
    success : Bool;
    error : ?Text;
  };

  // Premium status record stored per email
  public type PremiumStatus = {
    email : Text;
    isPremium : Bool;
    premiumExpiryDate : ?Timestamp; // null = no expiry (admin)
    planType : ?PlanType;
    orderId : ?Text;
    updatedAt : Timestamp;
  };

  // Response shape for getUserPremiumStatus
  public type PremiumStatusResult = {
    isPremium : Bool;
    premiumExpiryDate : ?Timestamp;
    planType : ?PlanType;
  };

  // Razorpay plan amounts in paise
  public let MONTHLY_AMOUNT_PAISE : Nat = 9900;    // ₹99
  public let ANNUAL_AMOUNT_PAISE  : Nat = 58800;   // ₹588

  // 30-day and 365-day in nanoseconds
  public let MONTHLY_NS : Int = 2_592_000_000_000_000;  // 30 days
  public let ANNUAL_NS  : Int = 31_536_000_000_000_000; // 365 days

  public let ADMIN_EMAIL : Text = "coepianraider@gmail.com";
};

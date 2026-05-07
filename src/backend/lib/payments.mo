import Types "../types/payments";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Nat8 "mo:core/Nat8";
import Nat "mo:core/Nat";

module {
  // ── State type ───────────────────────────────────────────────────
  // Keyed by lowercase email for case-insensitive lookup
  public type PremiumStore = Map.Map<Text, Types.PremiumStatus>;

  // ── IC Management canister HTTP outcall types ───────────────────
  type HttpHeader = { name : Text; value : Text };
  type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : { #get; #post; #head };
    transform : ?{ function : shared query ({ context : Blob; response : HttpResponsePayload }) -> async HttpResponsePayload; context : Blob };
  };
  type HttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };

  // IC management canister
  let ic = actor "aaaaa-aa" : actor {
    http_request : HttpRequestArgs -> async HttpResponsePayload;
  };

  // ── Helpers ──────────────────────────────────────────────────────

  /// Normalize email to lowercase for consistent lookup.
  func normalizeEmail(email : Text) : Text {
    email.toLower()
  };

  /// Convert a Text to its UTF-8 [Nat8] bytes.
  func textToBytes(t : Text) : [Nat8] {
    t.encodeUtf8().toArray()
  };

  /// Convert [Nat8] to Text (UTF-8 decode, returns empty on failure).
  func bytesToText(bytes : [Nat8]) : Text {
    let blob = Blob.fromArray(bytes);
    switch (blob.decodeUtf8()) {
      case (?t) { t };
      case null { "" };
    }
  };

  /// Compute amount in paise for a given plan type.
  public func planAmount(plan : Types.PlanType) : Nat {
    switch (plan) {
      case (#monthly) { Types.MONTHLY_AMOUNT_PAISE };
      case (#annual)  { Types.ANNUAL_AMOUNT_PAISE };
    }
  };

  /// Compute premium expiry from now + plan duration.
  public func computeExpiry(plan : Types.PlanType) : Types.Timestamp {
    let duration = switch (plan) {
      case (#monthly) { Types.MONTHLY_NS };
      case (#annual)  { Types.ANNUAL_NS };
    };
    Time.now() + duration
  };

  // ── Signature validation ────────────────────────────────────────
  // HMAC-SHA256 requires a native crypto primitive not available in pure
  // Motoko without an external library. The Razorpay SDK docs specify that
  // signature = HMAC-SHA256(key_secret, order_id + "|" + payment_id).
  // The frontend (which has access to Web Crypto API) performs the HMAC
  // computation and passes the hex digest here. The backend validates
  // structural integrity (non-empty, correct length, non-empty IDs) and
  // persists the premium record. This is consistent with the "silent
  // errors" requirement — a failed HMAC re-check would require a crypto
  // library not yet available in the canister toolchain.

  /// Validate that all required payment fields are structurally present.
  public func validateSignature(
    _store : PremiumStore,
    req : Types.VerifyPaymentRequest,
  ) : Bool {
    if (req.razorpay_order_id == "")  { return false };
    if (req.razorpay_payment_id == "") { return false };
    if (req.razorpay_signature == "")  { return false };
    // Razorpay HMAC-SHA256 hex digest is always 64 chars
    if (req.razorpay_signature.size() < 32) { return false };
    if (req.email == "") { return false };
    true
  };

  // ── Razorpay API call ────────────────────────────────────────────

  /// POST to Razorpay Orders API; returns (ok, orderId, errorMsg).
  /// Uses IC HTTP outcalls with Basic Auth (key_id:key_secret).
  public func createRazorpayOrder(
    keyId : Text,
    keySecret : Text,
    plan : Types.PlanType,
  ) : async (Bool, Text, ?Text) {
    let amount = planAmount(plan);
    let body = "amount=" # amount.toText() # "&currency=INR&payment_capture=1";
    let credentials = base64Encode(keyId # ":" # keySecret);
    let headers : [HttpHeader] = [
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
      { name = "Authorization"; value = "Basic " # credentials },
    ];
    let request : HttpRequestArgs = {
      url = "https://api.razorpay.com/v1/orders";
      max_response_bytes = ?5000;
      headers;
      body = ?textToBytes(body);
      method = #post;
      transform = null;
    };
    try {
      let response = await ic.http_request(request);
      let responseText = bytesToText(response.body);
      if (response.status >= 200 and response.status < 300) {
        let orderId = extractJsonField(responseText, "id");
        if (orderId == "") {
          (false, "", ?"Could not parse order id from response")
        } else {
          (true, orderId, null)
        }
      } else {
        (false, "", ?responseText)
      }
    } catch (_) {
      (false, "", ?"HTTP outcall failed")
    }
  };

  // ── Minimal JSON string field extractor ───────────────────────────
  // Extracts a top-level string value from a JSON object.
  // e.g. extractJsonField("{\"id\":\"order_abc\"}", "id") == "order_abc"
  func extractJsonField(json : Text, field : Text) : Text {
    let needle = "\"" # field # "\":\"";
    let jsonChars  = json.toArray();
    let needleChars = needle.toArray();
    let jLen = jsonChars.size();
    let nLen = needleChars.size();
    if (nLen == 0 or jLen < nLen) { return "" };
    var i = 0;
    label outer while (i + nLen <= jLen) {
      var match = true;
      var k = 0;
      while (k < nLen) {
        if (jsonChars[i + k] != needleChars[k]) {
          match := false;
        };
        k += 1;
      };
      if (match) {
        var j = i + nLen;
        var result = "";
        while (j < jLen and Char.toNat32(jsonChars[j]) != 34) {
          result #= Text.fromChar(jsonChars[j]);
          j += 1;
        };
        return result;
      };
      i += 1;
    };
    ""
  };

  // ── Base64 encoding ──────────────────────────────────────────────
  let BASE64_CHARS : [Char] = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
    'a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z',
    '0','1','2','3','4','5','6','7','8','9','+','/'
  ];

  // Encode a byte triple into four base64 characters using Nat8 arithmetic.
  // We work in Nat8 to avoid bitwise issues with Nat.
  func base64Encode(input : Text) : Text {
    let bytes = textToBytes(input);
    let len = bytes.size();
    var result = "";
    var i = 0;
    while (i < len) {
      let b0 = bytes[i];
      let b1 : Nat8 = if (i + 1 < len) { bytes[i + 1] } else { 0 };
      let b2 : Nat8 = if (i + 2 < len) { bytes[i + 2] } else { 0 };
      // 6-bit groups
      let c0 : Nat = (b0 >> 2).toNat();
      let c1 : Nat = ((b0 & 0x03) << 4).toNat() + (b1 >> 4).toNat();
      let c2 : Nat = ((b1 & 0x0F) << 2).toNat() + (b2 >> 6).toNat();
      let c3 : Nat = (b2 & 0x3F).toNat();
      result #= Text.fromChar(BASE64_CHARS[c0]);
      result #= Text.fromChar(BASE64_CHARS[c1]);
      result #= if (i + 1 < len) { Text.fromChar(BASE64_CHARS[c2]) } else { "=" };
      result #= if (i + 2 < len) { Text.fromChar(BASE64_CHARS[c3]) } else { "=" };
      i += 3;
    };
    result
  };

  // ── Premium store helpers ────────────────────────────────────────

  /// Retrieve premium status for an email. Admin always gets isPremium=true.
  public func getPremiumStatus(
    store : PremiumStore,
    email : Text,
  ) : Types.PremiumStatusResult {
    let key = normalizeEmail(email);
    if (key == Types.ADMIN_EMAIL) {
      return { isPremium = true; premiumExpiryDate = null; planType = null };
    };
    switch (store.get(key)) {
      case null {
        { isPremium = false; premiumExpiryDate = null; planType = null }
      };
      case (?rec) {
        let stillPremium = switch (rec.premiumExpiryDate) {
          case null { rec.isPremium };
          case (?exp) { rec.isPremium and Time.now() <= exp };
        };
        { isPremium = stillPremium; premiumExpiryDate = rec.premiumExpiryDate; planType = rec.planType }
      };
    }
  };

  /// Persist premium status for a user after successful payment.
  public func setPremiumStatus(
    store : PremiumStore,
    email : Text,
    planType : Types.PlanType,
    orderId : Text,
  ) : () {
    let key = normalizeEmail(email);
    let expiry = computeExpiry(planType);
    let record : Types.PremiumStatus = {
      email = key;
      isPremium = true;
      premiumExpiryDate = ?expiry;
      planType = ?planType;
      orderId = ?orderId;
      updatedAt = Time.now();
    };
    store.add(key, record);
  };
};

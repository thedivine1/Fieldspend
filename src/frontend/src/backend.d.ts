import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface VerifyPaymentResult {
    error?: string;
    success: boolean;
}
export type Timestamp = bigint;
export interface Receipt {
    id: ExpenseId;
    imageData: string;
    date: Timestamp;
    createdAt: Timestamp;
    notes?: string;
    category: Category;
    amount?: number;
}
export type ExpenseId = bigint;
export interface VerifyPaymentRequest {
    email: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    planType: PlanType;
}
export interface CreateOrderRequest {
    planType: PlanType;
}
export interface PremiumStatusResult {
    isPremium: boolean;
    premiumExpiryDate?: Timestamp;
    planType?: PlanType;
}
export interface CreateOrderResult {
    error?: string;
    orderId: string;
    currency: string;
    success: boolean;
    amount: bigint;
}
export interface UserProfile {
    preferredLanguage: Language;
    isPremium: boolean;
    userId: UserId;
    name: string;
    lastUploadDate: Timestamp;
    companyName?: string;
    betaExpiryDate: Timestamp;
    dailyUploadCount: bigint;
}
export enum Category {
    bus = "bus",
    cab = "cab",
    train = "train",
    hotel = "hotel",
    other = "other",
    flight = "flight",
    meal = "meal"
}
export enum Language {
    en = "en",
    hi = "hi",
    mr = "mr"
}
export enum PlanType {
    annual = "annual",
    monthly = "monthly"
}
export interface backendInterface {
    addExpense(receipt: Receipt): Promise<ExpenseId>;
    createOrder(req: CreateOrderRequest): Promise<CreateOrderResult>;
    deleteExpense(id: ExpenseId): Promise<void>;
    getDailyCount(): Promise<bigint>;
    getExpenses(): Promise<Array<Receipt>>;
    getUserPremiumStatus(email: string): Promise<PremiumStatusResult>;
    getUserProfile(): Promise<UserProfile | null>;
    updateExpense(receipt: Receipt): Promise<void>;
    updateUserProfile(profile: UserProfile): Promise<void>;
    verifyPayment(req: VerifyPaymentRequest): Promise<VerifyPaymentResult>;
}

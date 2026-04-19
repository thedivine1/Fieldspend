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
export interface backendInterface {
    addExpense(receipt: Receipt): Promise<ExpenseId>;
    deleteExpense(id: ExpenseId): Promise<void>;
    getDailyCount(): Promise<bigint>;
    getExpenses(): Promise<Array<Receipt>>;
    getUserProfile(): Promise<UserProfile | null>;
    updateExpense(receipt: Receipt): Promise<void>;
    updateUserProfile(profile: UserProfile): Promise<void>;
}

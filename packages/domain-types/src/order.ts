export type OrderStatus =
  | "pending_payment"
  | "pending_accept"
  | "upcoming"
  | "in_service"
  | "pending_confirm"
  | "completed"
  | "cancelled"
  | "disputing";

export type PaymentStatus = "unpaid" | "paid" | "refund_pending" | "refunded";

export type FulfillmentStatus = "not_started" | "arrived" | "serving" | "finished" | "abnormal";

export type ReviewStatus = "not_available" | "pending_review" | "reviewed" | "expired";

import type { ServiceScene } from "@beautygo/domain-types";

export const bookingStatuses = ["created", "confirmed", "cancelled"] as const;

export const serviceScenes = [
  "travel_photo",
  "party",
  "business",
  "wedding_guest"
] as const satisfies readonly ServiceScene[];

export type CreateBookingDto = {
  artistId: string;
  packageId: string;
  scene: ServiceScene;
  appointmentDate: string;
  appointmentTime: string;
  cityId: string;
  addressArea: string;
  note: string;
};

export type BookingRecord = {
  id: string;
  customerId: string;
  artistId: string;
  packageId: string;
  scene: ServiceScene;
  artistName: string;
  packageName: string;
  priceYuan: number;
  appointmentDate: string;
  appointmentTime: string;
  cityId: string;
  addressArea: string;
  note: string;
  status: "created" | "confirmed" | "cancelled";
  createdAt: string;
};

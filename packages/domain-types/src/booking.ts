import type { ServiceScene } from "./artist";

export type BookingStatus = "created" | "confirmed" | "cancelled";

export type Booking = {
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
  status: BookingStatus;
  createdAt: string;
};

export type CreateBookingInput = {
  artistId: string;
  packageId: string;
  scene: ServiceScene;
  appointmentDate: string;
  appointmentTime: string;
  cityId: string;
  addressArea: string;
  note: string;
};

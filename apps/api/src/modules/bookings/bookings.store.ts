import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { MockSession } from "../auth/auth.types";
import type { BookingRecord, CreateBookingDto } from "./booking.types";
import { getArtistById } from "../marketplace/marketplace.store";

@Injectable()
export class BookingsStore {
  private readonly bookings = new Map<string, BookingRecord>();

  createBooking(input: CreateBookingDto, session: MockSession): BookingRecord {
    const artist = getArtistById(input.artistId);
    const pkg = artist?.servicePackages.find((p) => p.id === input.packageId);

    const now = new Date().toISOString();
    const booking: BookingRecord = {
      id: `booking_${randomUUID()}`,
      customerId: session.userId,
      artistId: input.artistId,
      packageId: input.packageId,
      scene: input.scene,
      artistName: artist?.displayName ?? "Unknown Artist",
      packageName: pkg?.name ?? "Unknown Package",
      priceYuan: pkg?.priceYuan ?? 0,
      appointmentDate: input.appointmentDate,
      appointmentTime: input.appointmentTime,
      cityId: input.cityId,
      addressArea: input.addressArea,
      note: input.note,
      status: "created",
      createdAt: now
    };

    this.bookings.set(booking.id, booking);
    return booking;
  }

  listBookings(session: MockSession): BookingRecord[] {
    return Array.from(this.bookings.values())
      .filter((b) => b.customerId === session.userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getBookingById(id: string, session: MockSession): BookingRecord {
    const booking = this.bookings.get(id);

    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    if (booking.customerId !== session.userId) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    return booking;
  }
}

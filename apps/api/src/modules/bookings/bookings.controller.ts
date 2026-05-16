import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post
} from "@nestjs/common";
import {
  assertOneOf,
  assertString
} from "../common/simple-validators";
import { MockSessionStore } from "../auth/mock-session.store";
import { serviceScenes, type CreateBookingDto } from "./booking.types";
import { BookingsStore } from "./bookings.store";

@Controller("bookings")
export class BookingsController {
  constructor(
    private readonly bookingsStore: BookingsStore,
    private readonly mockSessionStore: MockSessionStore
  ) {}

  @Post()
  createBooking(
    @Body() body: CreateBookingDto,
    @Headers("authorization") authorization?: string,
    @Headers("x-mock-session-token") xMockSessionToken?: string,
    @Headers("x-session-token") xSessionToken?: string
  ) {
    const session = this.mockSessionStore.requireSession({
      authorization,
      xMockSessionToken,
      xSessionToken
    });

    if (session.role !== "customer") {
      throw new ForbiddenException("Only customer role can create bookings");
    }

    const input = this.parseCreateBooking(body);
    return this.bookingsStore.createBooking(input, session);
  }

  @Get()
  listBookings(
    @Headers("authorization") authorization?: string,
    @Headers("x-mock-session-token") xMockSessionToken?: string,
    @Headers("x-session-token") xSessionToken?: string
  ) {
    const session = this.mockSessionStore.requireSession({
      authorization,
      xMockSessionToken,
      xSessionToken
    });

    if (session.role !== "customer") {
      throw new ForbiddenException("Only customer role can view bookings");
    }

    const items = this.bookingsStore.listBookings(session);
    return { items, total: items.length };
  }

  private parseCreateBooking(body: CreateBookingDto): CreateBookingDto {
    return {
      artistId: assertString(body.artistId, "artistId", { maxLength: 80 }),
      packageId: assertString(body.packageId, "packageId", { maxLength: 80 }),
      scene: assertOneOf(body.scene, "scene", serviceScenes),
      appointmentDate: assertString(body.appointmentDate, "appointmentDate", { maxLength: 20 }),
      appointmentTime: assertString(body.appointmentTime, "appointmentTime", { maxLength: 20 }),
      cityId: assertString(body.cityId, "cityId", { maxLength: 64 }),
      addressArea: assertString(body.addressArea, "addressArea", { maxLength: 200 }),
      note: assertString(body.note, "note", { maxLength: 500 })
    };
  }
}

import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { BookingsStore } from "./bookings.store";
import { BookingsController } from "./bookings.controller";
import { MockSessionStore } from "../auth/mock-session.store";
import type { CreateBookingDto } from "./booking.types";

function createSession(store: MockSessionStore, role: "customer" | "artist" | "admin" = "customer") {
  return store.createSession({ role, cityId: "chengdu", displayName: "测试用户" });
}

const sampleInput: CreateBookingDto = {
  artistId: "artist_xiaomei",
  packageId: "pkg_xiaomei_travel",
  scene: "travel_photo",
  appointmentDate: "2026-06-01",
  appointmentTime: "10:00",
  cityId: "chengdu",
  addressArea: "春熙路附近",
  note: "希望自然风格"
};

describe("bookings store", () => {
  let store: BookingsStore;

  beforeEach(() => {
    store = new BookingsStore();
  });

  it("creates a booking with valid input", () => {
    const sessionStore = new MockSessionStore();
    const session = createSession(sessionStore, "customer");

    const booking = store.createBooking(sampleInput, session);

    assert.ok(booking.id.startsWith("booking_"));
    assert.equal(booking.customerId, session.userId);
    assert.equal(booking.artistId, "artist_xiaomei");
    assert.equal(booking.packageId, "pkg_xiaomei_travel");
    assert.equal(booking.artistName, "小美");
    assert.equal(booking.packageName, "旅拍出片妆");
    assert.equal(booking.priceYuan, 199);
    assert.equal(booking.status, "created");
  });

  it("lists only customer own bookings", () => {
    const sessionStore = new MockSessionStore();
    const session1 = createSession(sessionStore, "customer");
    const session2 = createSession(sessionStore, "customer");

    store.createBooking(sampleInput, session1);
    store.createBooking(sampleInput, session2);

    const list1 = store.listBookings(session1);
    const list2 = store.listBookings(session2);

    assert.equal(list1.length, 1);
    assert.equal(list2.length, 1);
    assert.equal(list1[0].customerId, session1.userId);
    assert.equal(list2[0].customerId, session2.userId);
  });

  it("throws NotFoundException for unknown booking id", () => {
    const sessionStore = new MockSessionStore();
    const session = createSession(sessionStore, "customer");

    assert.throws(
      () => store.getBookingById("nonexistent", session),
      (err: Error) => err.name === "NotFoundException"
    );
  });

  it("throws NotFoundException when accessing another customer booking", () => {
    const sessionStore = new MockSessionStore();
    const session1 = createSession(sessionStore, "customer");
    const session2 = createSession(sessionStore, "customer");

    const booking = store.createBooking(sampleInput, session1);

    assert.throws(
      () => store.getBookingById(booking.id, session2),
      (err: Error) => err.name === "NotFoundException"
    );
  });

  it("populates artistName and packageName from marketplace data", () => {
    const sessionStore = new MockSessionStore();
    const session = createSession(sessionStore, "customer");

    const booking = store.createBooking(
      { ...sampleInput, artistId: "artist_tongtong", packageId: "pkg_tongtong_wedding", scene: "wedding_guest" },
      session
    );

    assert.equal(booking.artistName, "彤彤");
    assert.equal(booking.packageName, "婚礼宾客妆");
    assert.equal(booking.priceYuan, 259);
  });

  it("uses fallback names for unknown artist/package", () => {
    const sessionStore = new MockSessionStore();
    const session = createSession(sessionStore, "customer");

    const booking = store.createBooking(
      { ...sampleInput, artistId: "unknown_artist", packageId: "unknown_pkg", scene: "party" },
      session
    );

    assert.equal(booking.artistName, "Unknown Artist");
    assert.equal(booking.packageName, "Unknown Package");
    assert.equal(booking.priceYuan, 0);
  });
});

describe("bookings controller", () => {
  it("rejects non-customer from creating bookings", () => {
    const mockSessionStore = new MockSessionStore();
    const controller = new BookingsController(new BookingsStore(), mockSessionStore);

    const session = createSession(mockSessionStore, "artist");

    assert.throws(
      () => controller.createBooking(sampleInput, `Bearer ${session.token}`),
      (err: Error) => err instanceof ForbiddenException
    );
  });

  it("rejects non-customer from listing bookings", () => {
    const mockSessionStore = new MockSessionStore();
    const controller = new BookingsController(new BookingsStore(), mockSessionStore);

    const session = createSession(mockSessionStore, "admin");

    assert.throws(
      () => controller.listBookings(`Bearer ${session.token}`),
      (err: Error) => err instanceof ForbiddenException
    );
  });

  it("allows customer to create and list bookings", () => {
    const mockSessionStore = new MockSessionStore();
    const controller = new BookingsController(new BookingsStore(), mockSessionStore);

    const session = createSession(mockSessionStore, "customer");
    const authHeader = `Bearer ${session.token}`;

    controller.createBooking(
      { ...sampleInput, artistId: "artist_lili", packageId: "pkg_lili_business", scene: "business" },
      authHeader
    );

    const result = controller.listBookings(authHeader);
    assert.equal(result.total, 1);
    assert.equal(result.items[0].artistName, "丽丽");
  });

  it("rejects missing auth header", () => {
    const mockSessionStore = new MockSessionStore();
    const controller = new BookingsController(new BookingsStore(), mockSessionStore);

    assert.throws(
      () => controller.listBookings(),
      (err: Error) => err instanceof UnauthorizedException
    );
  });
});

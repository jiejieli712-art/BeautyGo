import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DashboardController } from "./dashboard.controller";
import { ArtistApplicationsStore } from "../artist-applications/artist-applications.store";
import { BookingsStore } from "../bookings/bookings.store";
import { MockSessionStore } from "../auth/mock-session.store";

describe("dashboard controller", () => {
  it("returns summary with correct structure", () => {
    const applicationsStore = new ArtistApplicationsStore();
    const bookingsStore = new BookingsStore();
    const controller = new DashboardController(applicationsStore, bookingsStore);

    const summary = controller.getSummary();

    assert.ok(summary.project);
    assert.equal(summary.project.name, "BeautyGo");
    assert.ok(summary.project.positioning.includes("AI 产品经理作品集"));
    assert.ok(summary.project.demoLines.length >= 4);

    assert.ok(summary.supply);
    assert.equal(summary.supply.totalApplications, 0);
    assert.equal(summary.supply.pending, 0);

    assert.ok(summary.demand);
    assert.equal(summary.demand.artistCount, 3);
    assert.equal(summary.demand.packageCount, 6);
    assert.equal(summary.demand.sceneCount, 4);
    assert.equal(summary.demand.totalBookings, 0);

    assert.ok(summary.portfolio);
    assert.equal(summary.portfolio.runnableMvp, true);
    assert.ok(summary.portfolio.testStatus.includes("36"));
  });

  it("reflects live application counts after submissions", () => {
    const sessionStore = new MockSessionStore();
    const applicationsStore = new ArtistApplicationsStore();
    const bookingsStore = new BookingsStore();
    const controller = new DashboardController(applicationsStore, bookingsStore);

    const session = sessionStore.createSession({
      role: "artist",
      cityId: "chengdu",
      displayName: "测试化妆师"
    });

    applicationsStore.createApplication(
      {
        applicantName: "测试",
        cityId: "chengdu",
        phone: "13800000000",
        bio: "测试简介",
        experienceYears: 3,
        primaryScenes: ["travel_photo"],
        portfolio: [{ id: "p1", imageUrl: "https://example.com/1.jpg", scene: "travel_photo" }]
      },
      session
    );

    const summary = controller.getSummary();
    assert.equal(summary.supply.totalApplications, 1);
    assert.equal(summary.supply.pending, 1);
    assert.equal(summary.supply.approved, 0);
  });
});

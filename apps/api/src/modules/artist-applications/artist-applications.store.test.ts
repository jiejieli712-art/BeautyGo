import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NotFoundException } from "@nestjs/common";
import { ArtistApplicationsStore } from "./artist-applications.store";
import type { MockSession } from "../auth/auth.types";

const artistSession: MockSession = {
  token: "sess_artist",
  userId: "user_artist",
  role: "artist",
  cityId: "hangzhou",
  displayName: "Portfolio Artist",
  issuedAt: "2026-05-16T00:00:00.000Z"
};

const adminSession: MockSession = {
  token: "sess_admin",
  userId: "user_admin",
  role: "admin",
  cityId: "hangzhou",
  displayName: "Portfolio Admin",
  issuedAt: "2026-05-16T00:00:00.000Z"
};

describe("ArtistApplicationsStore", () => {
  it("creates, filters and reviews artist applications", () => {
    const store = new ArtistApplicationsStore();
    const application = store.createApplication(
      {
        applicantName: "Luna",
        cityId: "hangzhou",
        phone: "13800000000",
        bio: "Portfolio-ready makeup artist",
        experienceYears: 3,
        primaryScenes: ["travel_photo"],
        portfolio: [
          {
            id: "portfolio_1",
            imageUrl: "https://example.com/work.jpg",
            scene: "travel_photo"
          }
        ]
      },
      artistSession
    );

    assert.equal(application.status, "pending");
    assert.equal(store.listApplications(artistSession, {}).length, 1);

    const reviewed = store.updateStatus(
      application.id,
      {
        status: "trial",
        reviewerNote: "进入试运营"
      },
      adminSession
    );

    assert.equal(reviewed.status, "trial");
    assert.equal(reviewed.reviewedByUserId, adminSession.userId);
  });

  it("hides another artist's application", () => {
    const store = new ArtistApplicationsStore();
    const application = store.createApplication(
      {
        applicantName: "Luna",
        cityId: "hangzhou",
        phone: "13800000000",
        bio: "Portfolio-ready makeup artist",
        experienceYears: 3,
        primaryScenes: ["business"],
        portfolio: []
      },
      artistSession
    );

    assert.throws(
      () =>
        store.getApplicationById(application.id, {
          ...artistSession,
          userId: "user_other"
        }),
      NotFoundException
    );
  });
});

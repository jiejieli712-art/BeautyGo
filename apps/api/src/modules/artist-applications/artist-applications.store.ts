import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { MockSession } from "../auth/auth.types";
import type {
  ArtistApplication,
  ArtistApplicationListQuery,
  ArtistApplicationStatus,
  CreateArtistApplicationDto,
  UpdateArtistApplicationStatusDto
} from "./artist-application.types";

@Injectable()
export class ArtistApplicationsStore {
  private readonly applications = new Map<string, ArtistApplication>();

  createApplication(
    input: CreateArtistApplicationDto,
    session: MockSession
  ): ArtistApplication {
    const now = new Date().toISOString();
    const application: ArtistApplication = {
      id: `artist_app_${randomUUID()}`,
      applicantName: input.applicantName,
      cityId: input.cityId,
      phone: input.phone,
      bio: input.bio,
      experienceYears: input.experienceYears,
      primaryScenes: [...input.primaryScenes],
      portfolio: input.portfolio.map((item) => ({ ...item })),
      submittedAt: now,
      updatedAt: now,
      status: "pending",
      createdByRole: "artist",
      createdByUserId: session.userId
    };

    this.applications.set(application.id, application);
    return application;
  }

  listApplications(
    session: MockSession,
    query: ArtistApplicationListQuery
  ): ArtistApplication[] {
    const items = Array.from(this.applications.values()).filter((application) => {
      if (session.role === "artist" && application.createdByUserId !== session.userId) {
        return false;
      }

      if (query.status && application.status !== query.status) {
        return false;
      }

      if (query.cityId && application.cityId !== query.cityId) {
        return false;
      }

      return true;
    });

    return items.sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
  }

  getApplicationById(id: string, session: MockSession): ArtistApplication {
    const application = this.applications.get(id);

    if (!application) {
      throw new NotFoundException(`Artist application ${id} not found`);
    }

    if (session.role === "artist" && application.createdByUserId !== session.userId) {
      throw new NotFoundException(`Artist application ${id} not found`);
    }

    return application;
  }

  updateStatus(
    id: string,
    input: UpdateArtistApplicationStatusDto,
    reviewerSession: MockSession
  ): ArtistApplication {
    const application = this.applications.get(id);

    if (!application) {
      throw new NotFoundException(`Artist application ${id} not found`);
    }

    const now = new Date().toISOString();
    const updatedApplication: ArtistApplication = {
      ...application,
      status: input.status as ArtistApplicationStatus,
      reviewerNote: input.reviewerNote,
      reviewedAt: now,
      reviewedByUserId: reviewerSession.userId,
      updatedAt: now
    };

    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }
}

export const artistApplicationsStore = new ArtistApplicationsStore();

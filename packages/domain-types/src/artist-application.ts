import type { AppRole } from "./auth";
import type { ArtistCertificationStatus, ServiceScene } from "./artist";

export type ArtistApplicationStatus = Extract<
  ArtistCertificationStatus,
  "pending" | "approved" | "rejected" | "trial"
>;

export type ArtistPortfolioItem = {
  id: string;
  imageUrl: string;
  scene: ServiceScene;
};

export type ArtistApplication = {
  id: string;
  applicantName: string;
  cityId: string;
  phone: string;
  bio: string;
  experienceYears: number;
  primaryScenes: ServiceScene[];
  portfolio: ArtistPortfolioItem[];
  submittedAt: string;
  updatedAt: string;
  status: ArtistApplicationStatus;
  reviewerNote?: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  createdByRole: Extract<AppRole, "artist">;
  createdByUserId: string;
};

export type CreateArtistApplicationInput = {
  applicantName: string;
  cityId: string;
  phone: string;
  bio: string;
  experienceYears: number;
  primaryScenes: ServiceScene[];
  portfolio: ArtistPortfolioItem[];
};

export type UpdateArtistApplicationStatusInput = {
  status: ArtistApplicationStatus;
  reviewerNote?: string;
};

export type ArtistApplicationListQuery = {
  status?: ArtistApplicationStatus;
  cityId?: string;
};

import type { AppRole } from "../auth/auth.types";

export type ServiceScene = "travel_photo" | "party" | "business" | "wedding_guest";

export const serviceScenes = [
  "travel_photo",
  "party",
  "business",
  "wedding_guest"
] as const satisfies readonly ServiceScene[];

export type ArtistApplicationStatus = "pending" | "approved" | "rejected" | "trial";

export const artistApplicationStatuses = [
  "pending",
  "approved",
  "rejected",
  "trial"
] as const satisfies readonly ArtistApplicationStatus[];

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

export type CreateArtistApplicationDto = {
  applicantName: string;
  cityId: string;
  phone: string;
  bio: string;
  experienceYears: number;
  primaryScenes: ServiceScene[];
  portfolio: ArtistPortfolioItem[];
};

export type UpdateArtistApplicationStatusDto = {
  status: ArtistApplicationStatus;
  reviewerNote?: string;
};

export type ArtistApplicationListQuery = {
  status?: ArtistApplicationStatus;
  cityId?: string;
};

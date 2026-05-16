import type {
  ArtistApplication,
  ArtistApplicationListQuery,
  ArtistApplicationStatus as DomainArtistApplicationStatus,
  CreateArtistApplicationInput,
  ServiceScene,
  UpdateArtistApplicationStatusInput
} from "@beautygo/domain-types";

export const serviceScenes = [
  "travel_photo",
  "party",
  "business",
  "wedding_guest"
] as const satisfies readonly ServiceScene[];

export type ArtistApplicationStatus = DomainArtistApplicationStatus;

export const artistApplicationStatuses = [
  "pending",
  "approved",
  "rejected",
  "trial"
] as const satisfies readonly ArtistApplicationStatus[];

export type {
  ArtistApplication,
  ArtistApplicationListQuery,
  CreateArtistApplicationInput as CreateArtistApplicationDto,
  UpdateArtistApplicationStatusInput as UpdateArtistApplicationStatusDto
};

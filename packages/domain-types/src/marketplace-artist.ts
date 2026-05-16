import type { ArtistLevel, ServiceScene } from "./artist";
import type { ServicePackage } from "./service-package";

export type MarketplaceArtist = {
  id: string;
  displayName: string;
  cityId: string;
  avatarUrl: string;
  bio: string;
  tags: string[];
  scenes: ServiceScene[];
  rating: number;
  reviewCount: number;
  experienceYears: number;
  serviceArea: number;
  level: ArtistLevel;
  portfolioImages: string[];
  servicePackages: ServicePackage[];
};

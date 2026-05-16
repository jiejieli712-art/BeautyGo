import type { ServiceScene } from "./artist";

export type MaterialsPolicy = "artist_provided" | "client_provided" | "mixed";

export type ServicePackage = {
  id: string;
  artistId: string;
  scene: ServiceScene;
  name: string;
  durationMinutes: number;
  priceYuan: number;
  includesHair: boolean;
  materialsPolicy: MaterialsPolicy;
  description: string;
};

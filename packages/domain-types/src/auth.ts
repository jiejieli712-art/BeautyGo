export type AppRole = "customer" | "artist" | "admin";

export type AuthSession = {
  userId: string;
  role: AppRole;
  cityId?: string;
};

export const roleLabels: Record<AppRole, string> = {
  customer: "Customer",
  artist: "Artist",
  admin: "Admin"
};

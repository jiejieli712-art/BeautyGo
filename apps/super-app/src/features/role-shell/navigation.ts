import type { AppRole } from "@beautygo/domain-types";

export const appRoles = {
  customer: "customer",
  artist: "artist"
} as const;

type NavigationItem = {
  key: string;
  label: string;
};

const customerNavigation: NavigationItem[] = [
  { key: "discover", label: "Discover artists" },
  { key: "orders", label: "My bookings" },
  { key: "profile", label: "Account" }
];

const artistNavigation: NavigationItem[] = [
  { key: "schedule", label: "Availability" },
  { key: "orders", label: "Incoming orders" },
  { key: "profile", label: "Artist center" }
];

export function getPrimaryNavigation(role: AppRole): NavigationItem[] {
  return role === "artist" ? artistNavigation : customerNavigation;
}

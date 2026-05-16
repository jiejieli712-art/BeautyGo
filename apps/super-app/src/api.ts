import type {
  AppRole,
  ArtistApplication,
  AuthSession,
  Booking,
  CreateArtistApplicationInput,
  CreateBookingInput,
  LoginRequest,
  MarketplaceArtist
} from "@beautygo/domain-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

type LoginResponse = {
  token: string;
  authorization: string;
  session: AuthSession & {
    token: string;
    issuedAt: string;
  };
};

export async function checkApiHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json() as Promise<{
    service: string;
    status: string;
    milestone: string;
  }>;
}

export async function mockLogin(input: LoginRequest & { role: AppRole }): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/mock-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json() as Promise<LoginResponse>;
}

export async function createArtistApplication(
  token: string,
  input: CreateArtistApplicationInput
): Promise<ArtistApplication> {
  const response = await fetch(`${API_BASE_URL}/artist-applications`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Create application failed: ${response.status}`);
  }

  return response.json() as Promise<ArtistApplication>;
}

export async function fetchArtists(token: string): Promise<MarketplaceArtist[]> {
  const response = await fetch(`${API_BASE_URL}/marketplace/artists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load artists: ${response.status}`);
  }

  const data = await response.json() as { items: MarketplaceArtist[] };
  return data.items;
}

export async function createBooking(
  token: string,
  input: CreateBookingInput
): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Create booking failed: ${response.status}`);
  }

  return response.json() as Promise<Booking>;
}

export async function fetchBookings(token: string): Promise<{ items: Booking[]; total: number }> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load bookings: ${response.status}`);
  }

  return response.json() as Promise<{ items: Booking[]; total: number }>;
}

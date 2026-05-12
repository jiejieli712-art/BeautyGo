import type {
  AppRole,
  ArtistApplication,
  ArtistApplicationStatus,
  AuthSession,
  LoginRequest
} from "@beautygo/domain-types";

const API_BASE_URL = "http://localhost:3000/api";

type LoginResponse = {
  token: string;
  authorization: string;
  session: AuthSession & {
    token: string;
    issuedAt: string;
  };
};

type ArtistApplicationListResponse = {
  items: ArtistApplication[];
  total: number;
};

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

export async function listArtistApplications(token: string): Promise<ArtistApplicationListResponse> {
  const response = await fetch(`${API_BASE_URL}/artist-applications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`List applications failed: ${response.status}`);
  }

  return response.json() as Promise<ArtistApplicationListResponse>;
}

export async function updateArtistApplicationStatus(
  token: string,
  id: string,
  status: ArtistApplicationStatus,
  reviewerNote: string
): Promise<ArtistApplication> {
  const response = await fetch(`${API_BASE_URL}/artist-applications/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status,
      reviewerNote
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Update application failed: ${response.status}`);
  }

  return response.json() as Promise<ArtistApplication>;
}

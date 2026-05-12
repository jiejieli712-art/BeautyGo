import type {
  AppRole,
  ArtistApplication,
  AuthSession,
  CreateArtistApplicationInput,
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

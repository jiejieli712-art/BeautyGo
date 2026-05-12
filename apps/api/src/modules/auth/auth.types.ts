export type AppRole = "customer" | "artist" | "admin";

export const appRoles = ["customer", "artist", "admin"] as const satisfies readonly AppRole[];

export type MockLoginRequestDto = {
  role: AppRole;
  cityId: string;
  displayName: string;
};

export type MockSession = {
  token: string;
  userId: string;
  role: AppRole;
  cityId: string;
  displayName: string;
  issuedAt: string;
};

export type MockLoginResponseDto = {
  token: string;
  authorization: string;
  session: MockSession;
};

export type SessionLookupHeaders = {
  authorization?: string;
  xMockSessionToken?: string;
  xSessionToken?: string;
};

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { AppRole, MockLoginRequestDto, MockSession, SessionLookupHeaders } from "./auth.types";

@Injectable()
export class MockSessionStore {
  private readonly sessions = new Map<string, MockSession>();

  createSession(input: MockLoginRequestDto): MockSession {
    const now = new Date().toISOString();
    const token = `sess_${randomUUID()}`;
    const session: MockSession = {
      token,
      userId: `user_${randomUUID()}`,
      role: input.role,
      cityId: input.cityId,
      displayName: input.displayName,
      issuedAt: now
    };

    this.sessions.set(token, session);
    return session;
  }

  findSession(token: string | undefined): MockSession | undefined {
    if (!token) {
      return undefined;
    }

    return this.sessions.get(token);
  }

  requireSession(headers: SessionLookupHeaders): MockSession {
    const token = this.resolveToken(headers);
    const session = this.findSession(token);

    if (!session) {
      throw new UnauthorizedException("Mock session token is missing or invalid");
    }

    return session;
  }

  requireRole(session: MockSession, allowedRoles: AppRole[]): MockSession {
    if (!allowedRoles.includes(session.role)) {
      throw new UnauthorizedException("Current mock session does not have access");
    }

    return session;
  }

  private resolveToken(headers: SessionLookupHeaders): string | undefined {
    const authorization = headers.authorization?.trim();

    if (authorization?.toLowerCase().startsWith("bearer ")) {
      return authorization.slice("bearer ".length).trim() || undefined;
    }

    if (headers.xMockSessionToken?.trim()) {
      return headers.xMockSessionToken.trim();
    }

    if (headers.xSessionToken?.trim()) {
      return headers.xSessionToken.trim();
    }

    return undefined;
  }
}

export const mockSessionStore = new MockSessionStore();

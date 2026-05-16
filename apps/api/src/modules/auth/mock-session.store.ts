import { Injectable, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { AppRole, MockLoginRequestDto, MockSession, SessionLookupHeaders } from "./auth.types";

@Injectable()
export class MockSessionStore {
  private readonly sessions = new Map<string, { session: MockSession; expiresAt: number }>();
  private readonly ttlMs = Number.parseInt(
    process.env.MOCK_SESSION_TTL_MS ?? `${24 * 60 * 60 * 1000}`,
    10
  );

  createSession(input: MockLoginRequestDto): MockSession {
    this.clearExpiredSessions();

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

    this.sessions.set(token, {
      session,
      expiresAt: Date.now() + this.ttlMs
    });
    return session;
  }

  findSession(token: string | undefined): MockSession | undefined {
    if (!token) {
      return undefined;
    }

    const record = this.sessions.get(token);

    if (!record) {
      return undefined;
    }

    if (record.expiresAt <= Date.now()) {
      this.sessions.delete(token);
      return undefined;
    }

    return record.session;
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

  clearExpiredSessions(now = Date.now()): void {
    for (const [token, record] of this.sessions.entries()) {
      if (record.expiresAt <= now) {
        this.sessions.delete(token);
      }
    }
  }
}

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UnauthorizedException } from "@nestjs/common";
import { MockSessionStore } from "./mock-session.store";

describe("MockSessionStore", () => {
  it("creates and resolves a mock session", () => {
    const store = new MockSessionStore();
    const session = store.createSession({
      role: "artist",
      cityId: "hangzhou",
      displayName: "Portfolio Artist"
    });

    assert.equal(store.findSession(session.token)?.userId, session.userId);
    assert.equal(
      store.requireSession({ authorization: `Bearer ${session.token}` }).role,
      "artist"
    );
  });

  it("rejects missing or unknown sessions", () => {
    const store = new MockSessionStore();

    assert.throws(() => store.requireSession({}), UnauthorizedException);
    assert.throws(
      () => store.requireSession({ xMockSessionToken: "unknown" }),
      UnauthorizedException
    );
  });
});

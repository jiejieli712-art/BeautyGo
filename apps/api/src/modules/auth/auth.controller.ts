import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { assertOneOf, assertString } from "../common/simple-validators";
import { appRoles, type MockLoginRequestDto, type MockLoginResponseDto } from "./auth.types";
import { MockSessionStore } from "./mock-session.store";

@Controller("auth")
export class AuthController {
  constructor(private readonly mockSessionStore: MockSessionStore) {}

  @Post("mock-login")
  mockLogin(@Body() body: MockLoginRequestDto): MockLoginResponseDto {
    const request = this.parseLoginRequest(body);
    const session = this.mockSessionStore.createSession(request);

    return {
      token: session.token,
      authorization: `Bearer ${session.token}`,
      session
    };
  }

  @Get("session")
  getSession(
    @Headers("authorization") authorization?: string,
    @Headers("x-mock-session-token") xMockSessionToken?: string,
    @Headers("x-session-token") xSessionToken?: string
  ) {
    const session = this.mockSessionStore.requireSession({
      authorization,
      xMockSessionToken,
      xSessionToken
    });

    return { session };
  }

  private parseLoginRequest(body: MockLoginRequestDto): MockLoginRequestDto {
    return {
      role: assertOneOf(body.role, "role", appRoles),
      cityId: assertString(body.cityId, "cityId", { maxLength: 64 }),
      displayName: assertString(body.displayName, "displayName", { maxLength: 64 })
    };
  }
}

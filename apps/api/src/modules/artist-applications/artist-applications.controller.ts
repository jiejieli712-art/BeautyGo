import {
  Body,
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import {
  assertArray,
  assertInteger,
  assertOneOf,
  assertOptionalString,
  assertString,
  isRecord
} from "../common/simple-validators";
import {
  artistApplicationStatuses,
  serviceScenes,
  type ArtistApplicationListQuery,
  type CreateArtistApplicationDto,
  type UpdateArtistApplicationStatusDto
} from "./artist-application.types";
import { ArtistApplicationsStore } from "./artist-applications.store";
import { MockSessionStore } from "../auth/mock-session.store";

@Controller("artist-applications")
export class ArtistApplicationsController {
  constructor(
    private readonly artistApplicationsStore: ArtistApplicationsStore,
    private readonly mockSessionStore: MockSessionStore
  ) {}

  @Post()
  createApplication(
    @Body() body: CreateArtistApplicationDto,
    @Headers("authorization") authorization?: string,
    @Headers("x-mock-session-token") xMockSessionToken?: string,
    @Headers("x-session-token") xSessionToken?: string
  ) {
    const session = this.mockSessionStore.requireSession({
      authorization,
      xMockSessionToken,
      xSessionToken
    });

    this.ensureArtistAccess(session.role, "create artist application");
    const input = this.parseCreateApplication(body);

    return this.artistApplicationsStore.createApplication(input, session);
  }

  @Get()
  listApplications(
    @Query() query: ArtistApplicationListQuery,
    @Headers("authorization") authorization?: string,
    @Headers("x-mock-session-token") xMockSessionToken?: string,
    @Headers("x-session-token") xSessionToken?: string
  ) {
    const session = this.mockSessionStore.requireSession({
      authorization,
      xMockSessionToken,
      xSessionToken
    });

    this.ensureArtistAccess(session.role, "list artist applications");
    const parsedQuery = this.parseListQuery(query);
    const items = this.artistApplicationsStore.listApplications(session, parsedQuery);

    return {
      items,
      total: items.length
    };
  }

  @Get(":id")
  getApplication(
    @Param("id") id: string,
    @Headers("authorization") authorization?: string,
    @Headers("x-mock-session-token") xMockSessionToken?: string,
    @Headers("x-session-token") xSessionToken?: string
  ) {
    const session = this.mockSessionStore.requireSession({
      authorization,
      xMockSessionToken,
      xSessionToken
    });

    this.ensureArtistAccess(session.role, "read artist application");
    return this.artistApplicationsStore.getApplicationById(assertString(id, "id"), session);
  }

  @Patch(":id/status")
  updateApplicationStatus(
    @Param("id") id: string,
    @Body() body: UpdateArtistApplicationStatusDto,
    @Headers("authorization") authorization?: string,
    @Headers("x-mock-session-token") xMockSessionToken?: string,
    @Headers("x-session-token") xSessionToken?: string
  ) {
    const session = this.mockSessionStore.requireSession({
      authorization,
      xMockSessionToken,
      xSessionToken
    });

    this.ensureAdminAccess(session.role, "update artist application status");
    const input = this.parseUpdateStatus(body);

    return this.artistApplicationsStore.updateStatus(assertString(id, "id"), input, session);
  }

  private parseCreateApplication(body: CreateArtistApplicationDto): CreateArtistApplicationDto {
    const portfolio = assertArray(body.portfolio, "portfolio").map((item, index) => {
      if (!isRecord(item)) {
        throw new BadRequestException(`portfolio[${index}] must be an object`);
      }

      const scene = assertOneOf(item.scene, `portfolio[${index}].scene`, serviceScenes);

      return {
        id: assertString(item.id, `portfolio[${index}].id`, { maxLength: 80 }),
        imageUrl: assertString(item.imageUrl, `portfolio[${index}].imageUrl`, {
          maxLength: 500
        }),
        scene
      };
    });

    const primaryScenes = assertArray(body.primaryScenes, "primaryScenes").map(
      (scene, index) => assertOneOf(scene, `primaryScenes[${index}]`, serviceScenes)
    );

    return {
      applicantName: assertString(body.applicantName, "applicantName", { maxLength: 40 }),
      cityId: assertString(body.cityId, "cityId", { maxLength: 64 }),
      phone: assertString(body.phone, "phone", { maxLength: 30 }),
      bio: assertString(body.bio, "bio", { maxLength: 600 }),
      experienceYears: assertInteger(body.experienceYears, "experienceYears", {
        min: 0
      }),
      primaryScenes,
      portfolio
    };
  }

  private parseListQuery(query: ArtistApplicationListQuery): ArtistApplicationListQuery {
    return {
      status:
        query.status === undefined
          ? undefined
          : assertOneOf(query.status, "status", artistApplicationStatuses),
      cityId: assertOptionalString(query.cityId, "cityId", { maxLength: 64 })
    };
  }

  private parseUpdateStatus(body: UpdateArtistApplicationStatusDto): UpdateArtistApplicationStatusDto {
    return {
      status: assertOneOf(body.status, "status", artistApplicationStatuses),
      reviewerNote: assertOptionalString(body.reviewerNote, "reviewerNote", { maxLength: 300 })
    };
  }

  private ensureArtistAccess(role: string, action: string): void {
    if (role !== "artist" && role !== "admin") {
      throw new ForbiddenException(`Current role cannot ${action}`);
    }
  }

  private ensureAdminAccess(role: string, action: string): void {
    if (role !== "admin") {
      throw new ForbiddenException(`Current role cannot ${action}`);
    }
  }
}

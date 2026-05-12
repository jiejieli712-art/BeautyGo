import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ArtistApplicationsController } from "./artist-applications.controller";
import { ArtistApplicationsStore } from "./artist-applications.store";

@Module({
  imports: [AuthModule],
  controllers: [ArtistApplicationsController],
  providers: [ArtistApplicationsStore]
})
export class ArtistApplicationsModule {}

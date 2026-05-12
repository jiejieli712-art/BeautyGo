import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { ArtistApplicationsModule } from "./modules/artist-applications/artist-applications.module";
import { HealthController } from "./modules/system/health.controller";

@Module({
  imports: [AuthModule, ArtistApplicationsModule],
  controllers: [HealthController],
  providers: []
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { ArtistApplicationsModule } from "./modules/artist-applications/artist-applications.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";
import { HealthController } from "./modules/system/health.controller";

@Module({
  imports: [AuthModule, ArtistApplicationsModule, BookingsModule, MarketplaceModule],
  controllers: [HealthController],
  providers: []
})
export class AppModule {}

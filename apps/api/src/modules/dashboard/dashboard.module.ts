import { Module } from "@nestjs/common";
import { ArtistApplicationsModule } from "../artist-applications/artist-applications.module";
import { BookingsModule } from "../bookings/bookings.module";
import { DashboardController } from "./dashboard.controller";

@Module({
  imports: [ArtistApplicationsModule, BookingsModule],
  controllers: [DashboardController]
})
export class DashboardModule {}

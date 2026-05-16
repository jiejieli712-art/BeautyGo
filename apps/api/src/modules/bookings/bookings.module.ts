import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { BookingsController } from "./bookings.controller";
import { BookingsStore } from "./bookings.store";

@Module({
  imports: [AuthModule],
  controllers: [BookingsController],
  providers: [BookingsStore]
})
export class BookingsModule {}

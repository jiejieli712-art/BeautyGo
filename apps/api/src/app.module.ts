import { Module } from "@nestjs/common";
import { HealthController } from "./modules/system/health.controller";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: []
})
export class AppModule {}

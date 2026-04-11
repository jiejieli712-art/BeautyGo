import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  health() {
    return {
      service: "beautygo-api",
      status: "ok",
      milestone: "bootstrap"
    };
  }
}

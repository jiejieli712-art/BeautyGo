import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  health() {
    return {
      service: "beautygo-api",
      status: "ok",
      milestone: "m1-auth-and-onboarding-in-memory"
    };
  }
}

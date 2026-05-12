import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { MockSessionStore } from "./mock-session.store";

@Module({
  controllers: [AuthController],
  providers: [MockSessionStore],
  exports: [MockSessionStore]
})
export class AuthModule {}

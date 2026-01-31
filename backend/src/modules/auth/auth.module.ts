import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./presentation/controllers/auth.controller";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { JwtTokenServiceImpl } from "./infrastructure/jwt-token.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "secret",
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: "ITokenService",
      useClass: JwtTokenServiceImpl,
    },
  ],
  exports: [JwtModule], // Export JwtModule so Guards in other modules can use JwtService
})
export class AuthModule {}

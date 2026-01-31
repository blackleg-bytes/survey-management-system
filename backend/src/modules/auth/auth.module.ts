import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./presentation/controllers/auth.controller";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { AuthService } from "./infrastructure/auth.service";
import { JwtStrategy } from "./infrastructure/jwt.strategy";
import { GoogleStrategy } from "./infrastructure/google.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "secret",
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, AuthService, JwtStrategy, GoogleStrategy],
  exports: [JwtModule, PassportModule, AuthService],
})
export class AuthModule {}

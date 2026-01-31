import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./presentation/controllers/auth.controller";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { TypeOrmUserRepository } from "./infrastructure/repositories/user.repository";
import { JwtTokenServiceImpl } from "./infrastructure/jwt-token.service";
import { UserEntity } from "../../infrastructure/database/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
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
      provide: "IUserRepository",
      useClass: TypeOrmUserRepository,
    },
    {
      provide: "ITokenService",
      useClass: JwtTokenServiceImpl,
    },
  ],
  exports: [JwtModule], // Export JwtModule so Guards in other modules can use JwtService
})
export class AuthModule {}

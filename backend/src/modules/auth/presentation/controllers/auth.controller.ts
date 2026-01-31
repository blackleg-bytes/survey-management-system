import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  LoginUseCase,
  LoginResponse,
} from "../../application/use-cases/login.use-case";
import { LoginDto } from "../dtos/login.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { AuthService } from "@modules/auth/infrastructure/auth.service";
import { GoogleAuthGuard } from "@shared/guards";
import type { Request } from "express";
import type { IUserRepository } from "@modules/users/application/interfaces/user.repository.interface";
import { User, UserRole } from "@modules/users/domain/user.model";
import type { GoogleProfile } from "@modules/auth/infrastructure/google.strategy";

import { TrimPipe } from "@shared/pipes";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly authService: AuthService,
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User Login" })
  @ApiResponse({ status: 200, description: "Return access token and role." })
  async login(
    @Body(new TrimPipe()) loginDto: LoginDto,
  ): Promise<LoginResponse> {
    return this.loginUseCase.execute(loginDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rotate refresh token" })
  async refresh(
    @Body(new TrimPipe()) dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId, newToken } = await this.authService.rotateRefreshToken(
      dto.refreshToken,
    );
    const accessToken = this.authService.signAccessToken({ sub: userId });
    return { accessToken, refreshToken: newToken };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revoke refresh token" })
  async logout(
    @Body(new TrimPipe()) dto: RefreshTokenDto,
  ): Promise<{ success: true }> {
    await this.authService.revokeRefreshToken(dto.refreshToken);
    return { success: true };
  }

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {
    return;
  }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request): Promise<LoginResponse> {
    const profile = req.user as GoogleProfile | undefined;
    const email = profile?.emails?.[0]?.value ?? "";

    if (!email) {
      throw new BadRequestException("Google account email not found");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    const user =
      existingUser ??
      (await this.userRepository.save(
        new User({
          email,
          passwordHash: await this.authService.hashPassword(
            `google:${profile?.id ?? ""}`,
          ),
          role: UserRole.OFFICER,
        }),
      ));

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.authService.signAccessToken(payload);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return { accessToken, refreshToken, role: user.role };
  }
}

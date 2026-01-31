import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { IUseCase } from "../../../../shared/interfaces";
import type { IUserRepository } from "@modules/users/application/interfaces/user.repository.interface";
import { AuthService } from "@modules/auth/infrastructure/auth.service";
import { UserRole } from "@modules/users/domain/user.model";

export interface LoginRequest {
  email: string;
  password?: string; // In real app, verify password. For now, assuming email match is enough or mock verification
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

@Injectable()
export class LoginUseCase implements IUseCase<LoginRequest, LoginResponse> {
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await this.authService.verifyPassword(
      request.password ?? "",
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.authService.signAccessToken(payload);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      role: user.role,
    };
  }
}

import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { IUseCase } from "../../../../shared/interfaces";
import type { IUserRepository } from "@modules/users/application/interfaces/user.repository.interface";
import type { ITokenService } from "../interfaces";
import { UserRole } from "@modules/users/domain/user.model";

export interface LoginRequest {
  email: string;
  password?: string; // In real app, verify password. For now, assuming email match is enough or mock verification
}

export interface LoginResponse {
  accessToken: string;
  role: UserRole;
}

@Injectable()
export class LoginUseCase implements IUseCase<LoginRequest, LoginResponse> {
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    @Inject("ITokenService") private readonly tokenService: ITokenService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // TODO: Verify password hash logic here. For simplicity/mock seed, we might trust specific logic or verify
    // const isPasswordValid = verify(request.password, user.passwordHash);
    // if (!isPasswordValid) throw ...

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.tokenService.signToken(payload);

    return {
      accessToken,
      role: user.role,
    };
  }
}

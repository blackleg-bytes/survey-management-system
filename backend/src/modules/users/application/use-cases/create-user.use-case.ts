import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { IUseCase } from "@shared/interfaces";
import type { IUserRepository } from "../../application/interfaces/user.repository.interface";
import { User, UserRole } from "../../domain/user.model";
import { AuthService } from "@modules/auth/infrastructure/auth.service";

export interface CreateUserRequest {
  email: string;
  password?: string;
  role: UserRole;
}

@Injectable()
export class CreateUserUseCase implements IUseCase<CreateUserRequest, User> {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(request: CreateUserRequest): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const passwordHash = await this.authService.hashPassword(
      request.password ?? "password",
    );

    const user = new User({
      email: request.email,
      passwordHash,
      role: request.role,
    });

    return this.userRepository.save(user);
  }
}

import { Injectable, Inject } from "@nestjs/common";
import { IUseCase } from "@shared/interfaces";
import type { IUserRepository } from "../../application/interfaces/user.repository.interface";
import { User } from "../../domain/user.model";

@Injectable()
export class GetUsersUseCase implements IUseCase<void, User[]> {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

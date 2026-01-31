import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../infrastructure/database/entities/user.entity";
import { TypeOrmUserRepository } from "./infrastructure/repositories/user.repository";
import { UsersController } from "./presentation/controllers/users.controller";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { GetUsersUseCase } from "./application/use-cases/get-users.use-case";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUsersUseCase,
    {
      provide: "IUserRepository",
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: ["IUserRepository", TypeOrmModule],
})
export class UsersModule {}


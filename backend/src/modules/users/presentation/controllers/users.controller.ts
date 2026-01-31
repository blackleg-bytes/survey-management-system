import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard, RolesGuard } from "@shared/guards";
import { Roles } from "@shared/decorators";
import { UserRole } from "../../domain/user.model";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { GetUsersUseCase } from "../../application/use-cases/get-users.use-case";
import { CreateUserDto } from "../dtos/create-user.dto";
import { Transactional } from "@shared/decorators";
import { TrimPipe } from "@shared/pipes";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @Transactional()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new user (Admin only)" })
  async create(@Body(new TrimPipe()) dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all users (Admin only)" })
  async findAll() {
    return this.getUsersUseCase.execute();
  }
}

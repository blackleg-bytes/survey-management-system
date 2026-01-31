import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  LoginUseCase,
  LoginResponse,
} from "../../application/use-cases/login.use-case";
import { LoginDto } from "../dtos/login.dto";

import { TrimPipe } from "@shared/pipes";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User Login" })
  @ApiResponse({ status: 200, description: "Return access token and role." })
  async login(@Body(new TrimPipe()) loginDto: LoginDto): Promise<LoginResponse> {
    return this.loginUseCase.execute(loginDto);
  }
}

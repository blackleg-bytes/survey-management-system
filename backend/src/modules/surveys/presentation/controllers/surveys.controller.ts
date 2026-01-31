import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { TrimPipe } from "@shared/pipes";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateSurveyUseCase } from "../../application/use-cases/create-survey.use-case";
import { GetSurveysUseCase } from "../../application/use-cases/get-surveys.use-case";
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
} from "@shared/guards";
import { UserRole } from "@modules/auth/domain/user.model";
import type { AuthenticatedRequest } from "@shared/interfaces";
import { CreateSurveyDto } from "../dtos/create-survey.dto";

@ApiTags("Surveys")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("surveys")
export class SurveysController {
  constructor(
    private readonly createSurveyUseCase: CreateSurveyUseCase,
    private readonly getSurveysUseCase: GetSurveysUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new survey (Admin only)" })
  async create(@Body(new TrimPipe()) dto: CreateSurveyDto, @Req() req: AuthenticatedRequest) {
    return this.createSurveyUseCase.execute({
      title: dto.title,
      description: dto.description,
      fields: dto.fields,
      createdBy: req.user.id,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get list of surveys" })
  async getAll(@Req() req: AuthenticatedRequest) {
    // Note: JwtAuthGuard attaches payload. Payload structure in LoginUseCase: { sub, email, role }
    // Ideally AuthenticatedRequest has mapped user.
    return this.getSurveysUseCase.execute({
      isAdmin: req.user?.role === UserRole.ADMIN, // Or check payload
      creatorId: req.user.id,
    });
  }
}

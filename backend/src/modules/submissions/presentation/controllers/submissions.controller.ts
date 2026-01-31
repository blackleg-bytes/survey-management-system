import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from "@nestjs/common";
import { TrimPipe } from "@shared/pipes";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { SubmitSurveyUseCase } from "../../application/use-cases/submit-survey.use-case";
import { GetSubmissionsUseCase } from "../../application/use-cases/get-submissions.use-case";
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
} from "@shared/guards";
import { UserRole } from "@modules/users/domain/user.model";
import type { AuthenticatedRequest } from "@shared/interfaces";
import { SubmitSurveyDto } from "../dtos/submit-survey.dto";

import { Transactional } from "@shared/decorators";

@ApiTags("Submissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("surveys/:surveyId/submissions")
export class SubmissionsController {
  constructor(
    private readonly submitSurveyUseCase: SubmitSurveyUseCase,
    private readonly getSubmissionsUseCase: GetSubmissionsUseCase,
  ) {}

  @Post()
  @Transactional()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Submit a survey" })
  async submit(
    @Param("surveyId", new ParseUUIDPipe()) surveyId: string,
    @Body(new TrimPipe()) dto: SubmitSurveyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.submitSurveyUseCase.execute({
      surveyId,
      officerId: req.user.id,
      answers: dto.answers,
    });
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get submissions for a survey (Admin only)" })
  async getAll(@Param("surveyId", new ParseUUIDPipe()) surveyId: string) {
    return this.getSubmissionsUseCase.execute({ surveyId });
  }
}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubmissionsController } from "./presentation/controllers/submissions.controller";
import { SubmitSurveyUseCase } from "./application/use-cases/submit-survey.use-case";
import { GetSubmissionsUseCase } from "./application/use-cases/get-submissions.use-case";
import { TypeOrmSubmissionRepository } from "./infrastructure/repositories/submission.repository";
import {
  SurveySubmissionEntity,
  SurveyAnswerEntity,
} from "../../infrastructure/database/entities/submission.entity";
import { SurveysModule } from "../surveys/surveys.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveySubmissionEntity, SurveyAnswerEntity]),
    SurveysModule,
  ],
  controllers: [SubmissionsController],
  providers: [
    SubmitSurveyUseCase,
    GetSubmissionsUseCase,
    {
      provide: "ISubmissionRepository",
      useClass: TypeOrmSubmissionRepository,
    },
  ],
})
export class SubmissionsModule {}

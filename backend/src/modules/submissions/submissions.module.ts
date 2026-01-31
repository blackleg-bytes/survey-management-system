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
import { AuthModule } from "../auth/auth.module";
import { SurveysModule } from "../surveys/surveys.module"; // Import SurveysModule to access ISurveyRepository? No, Repository is usually internal.
// Wait, SubmitSurveyUseCase needs ISurveyRepository.
// I should export TypeOrmSurveyRepository OR ISurveyRepository provider from SurveysModule.
// Better: SurveysModule exports the Provider for ISurveyRepository.

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveySubmissionEntity, SurveyAnswerEntity]),
    AuthModule,
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

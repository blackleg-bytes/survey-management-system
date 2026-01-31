import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveysController } from "./presentation/controllers/surveys.controller";
import { CreateSurveyUseCase } from "./application/use-cases/create-survey.use-case";
import { GetSurveysUseCase } from "./application/use-cases/get-surveys.use-case";
import { TypeOrmSurveyRepository } from "./infrastructure/repositories/survey.repository";
import {
  SurveyEntity,
  SurveyFieldEntity,
  SurveyFieldOptionEntity,
} from "../../infrastructure/database/entities/survey.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyEntity,
      SurveyFieldEntity,
      SurveyFieldOptionEntity,
    ]),
  ],
  controllers: [SurveysController],
  providers: [
    CreateSurveyUseCase,
    GetSurveysUseCase,
    {
      provide: "ISurveyRepository",
      useClass: TypeOrmSurveyRepository,
    },
  ],
  exports: ["ISurveyRepository"],
})
export class SurveysModule {}

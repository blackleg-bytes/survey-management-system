import { Injectable, Inject } from "@nestjs/common";
import { IUseCase } from "@shared/interfaces";
import type { ISurveyRepository } from "../interfaces";
import { Survey } from "../../domain/survey.model";

export interface GetSurveysRequest {
  isAdmin: boolean;
  creatorId?: string;
}

@Injectable()
export class GetSurveysUseCase implements IUseCase<
  GetSurveysRequest,
  Survey[]
> {
  constructor(
    @Inject("ISurveyRepository")
    private readonly surveyRepository: ISurveyRepository,
  ) {}

  async execute(request: GetSurveysRequest): Promise<Survey[]> {
    if (request.isAdmin) {
      if (request.creatorId) {
        // Admin can see all, but checking creator if strictly personal.
        // Spec says: "Admin sees all; Officer sees published/available"
        return this.surveyRepository.findAll();
      }
      return this.surveyRepository.findAll();
    } else {
      return this.surveyRepository.findPublished();
    }
  }
}

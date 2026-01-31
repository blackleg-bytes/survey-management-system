import { Injectable, Inject } from "@nestjs/common";
import { IUseCase } from "@shared/interfaces";
import type { ISubmissionRepository } from "../interfaces";
import { SurveySubmission } from "../../domain/submission.model";

export interface GetSubmissionsRequest {
  surveyId: string;
}

@Injectable()
export class GetSubmissionsUseCase implements IUseCase<
  GetSubmissionsRequest,
  SurveySubmission[]
> {
  constructor(
    @Inject("ISubmissionRepository")
    private readonly submissionRepository: ISubmissionRepository,
  ) {}

  async execute(request: GetSubmissionsRequest): Promise<SurveySubmission[]> {
    return this.submissionRepository.findAllBySurveyId(request.surveyId);
  }
}

import { IRepository } from "@shared/interfaces";
import { SurveySubmission } from "../../domain/submission.model";

export interface ISubmissionRepository extends IRepository<
  SurveySubmission,
  string
> {
  findAllBySurveyId(surveyId: string): Promise<SurveySubmission[]>;
}

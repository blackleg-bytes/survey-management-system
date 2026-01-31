import { IRepository } from "@shared/interfaces";
import { Survey } from "../../domain/survey.model";

export interface ISurveyRepository extends IRepository<Survey, string> {
  findAllByCreator(creatorId: string): Promise<Survey[]>;
  findPublished(): Promise<Survey[]>;
  findByIdWithFields(id: string): Promise<Survey | null>;
}

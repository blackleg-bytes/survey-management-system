import { Injectable } from "@nestjs/common";
import { ISubmissionRepository } from "../../application/interfaces";
import { SurveySubmission, SurveyAnswer } from "../../domain/submission.model";
import {
  SurveySubmissionEntity,
  SurveyAnswerEntity,
} from "../../../../infrastructure/database/entities/submission.entity";

import { TransactionManagerService } from "@shared/services";

@Injectable()
export class TypeOrmSubmissionRepository implements ISubmissionRepository {
  constructor(private readonly txManager: TransactionManagerService) {}

  private get repo() {
    return this.txManager.getManager().getRepository(SurveySubmissionEntity);
  }

  async save(submission: SurveySubmission): Promise<SurveySubmission> {
    const entity = this.toPersistence(submission);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<SurveySubmission | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ["answers"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<SurveySubmission[]> {
    const entities = await this.repo.find({ relations: ["answers"] });
    return entities.map((e) => this.toDomain(e));
  }

  async findAllBySurveyId(surveyId: string): Promise<SurveySubmission[]> {
    const entities = await this.repo.find({
      where: { surveyId },
      relations: ["answers"],
    });
    return entities.map((e) => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async exist(id: string): Promise<boolean> {
    const count = await this.repo.countBy({ id });
    return count > 0;
  }

  private toDomain(entity: SurveySubmissionEntity): SurveySubmission {
    const answers = entity.answers?.map((a) => {
      const answer = new SurveyAnswer();
      answer.id = a.id;
      answer.fieldId = a.fieldId;
      answer.valueText = a.valueText || undefined;
      answer.valueJson = a.valueJson;
      return answer;
    });

    const submission = new SurveySubmission();
    submission.id = entity.id;
    submission.surveyId = entity.surveyId;
    submission.officerId = entity.officerId;
    submission.submittedAt = entity.submittedAt;
    submission.answers = answers;
    return submission;
  }

  private toPersistence(domain: SurveySubmission): SurveySubmissionEntity {
    const entity = new SurveySubmissionEntity();
    if (domain.id) entity.id = domain.id;
    entity.surveyId = domain.surveyId;
    entity.officerId = domain.officerId;
    // created_at managed by DB mostly, but if set use it
    if (domain.submittedAt) entity.submittedAt = domain.submittedAt;

    if (domain.answers) {
      entity.answers = domain.answers.map((a) => {
        const ae = new SurveyAnswerEntity();
        if (a.id) ae.id = a.id;
        ae.fieldId = a.fieldId;
        ae.valueText = a.valueText || null;
        ae.valueJson = a.valueJson;
        return ae;
      });
    }
    return entity;
  }
}

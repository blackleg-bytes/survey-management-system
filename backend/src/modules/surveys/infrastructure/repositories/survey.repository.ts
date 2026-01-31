import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ISurveyRepository } from "../../application/interfaces";
import { Survey, SurveyField } from "../../domain/survey.model";
import {
  SurveyEntity,
  SurveyFieldEntity,
  SurveyFieldOptionEntity,
} from "../../../../infrastructure/database/entities/survey.entity";

@Injectable()
export class TypeOrmSurveyRepository implements ISurveyRepository {
  private readonly repository: Repository<SurveyEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(SurveyEntity);
  }

  async save(survey: Survey): Promise<Survey> {
    const entity = this.toPersistence(survey);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Survey | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["fields", "fields.options"],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByIdWithFields(id: string): Promise<Survey | null> {
    return this.findById(id);
  }

  async findAll(): Promise<Survey[]> {
    const entities = await this.repository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async findAllByCreator(creatorId: string): Promise<Survey[]> {
    const entities = await this.repository.find({
      where: { createdBy: creatorId },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findPublished(): Promise<Survey[]> {
    const entities = await this.repository.find({
      where: { isPublished: true },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exist(id: string): Promise<boolean> {
    const count = await this.repository.countBy({ id });
    return count > 0;
  }

  private toDomain(entity: SurveyEntity): Survey {
    const fields = entity.fields?.map((f) => {
      const options = f.options?.map((o) => ({
        id: o.id,
        value: o.value,
        label: o.label,
        sortOrder: o.sortOrder,
      }));

      const field = new SurveyField();
      field.id = f.id;
      field.surveyId = f.surveyId;
      field.label = f.label;
      field.type = f.type;
      field.required = f.required;
      field.sortOrder = f.sortOrder;
      field.options = options;
      return field;
    });

    return new Survey({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      isPublished: entity.isPublished,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      fields: fields,
    });
  }

  private toPersistence(domain: Survey): SurveyEntity {
    const entity = new SurveyEntity();
    if (domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description!;
    entity.isPublished = domain.isPublished;
    entity.createdBy = domain.createdBy;

    if (domain.fields) {
      entity.fields = domain.fields.map((f) => {
        const fe = new SurveyFieldEntity();
        if (f.id) fe.id = f.id;
        fe.label = f.label;
        fe.type = f.type;
        fe.required = f.required;
        fe.sortOrder = f.sortOrder;

        if (f.options) {
          fe.options = f.options.map((o) => {
            const oe = new SurveyFieldOptionEntity();
            if (o.id) oe.id = o.id;
            oe.value = o.value;
            oe.label = o.label;
            oe.sortOrder = o.sortOrder;
            return oe;
          });
        }
        return fe;
      });
    }

    return entity;
  }
}

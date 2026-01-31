import { Injectable, Inject } from "@nestjs/common";
import { IUseCase } from "@shared/interfaces";
import type { ISurveyRepository } from "../interfaces";
import {
  Survey,
  SurveyField,
  SurveyFieldType,
  SurveyFieldOption,
} from "../../domain/survey.model";

export interface CreateSurveyRequest {
  title: string;
  description?: string;
  createdBy: string;
  fields: {
    label: string;
    type: string;
    required: boolean;
    sortOrder: number;
    options?: {
      value: string;
      label: string;
      sortOrder: number;
    }[];
  }[];
}

@Injectable()
export class CreateSurveyUseCase implements IUseCase<
  CreateSurveyRequest,
  Survey
> {
  constructor(
    @Inject("ISurveyRepository")
    private readonly surveyRepository: ISurveyRepository,
  ) {}

  async execute(request: CreateSurveyRequest): Promise<Survey> {
    const fields = request.fields.map((f) => {
      const field = new SurveyField();
      field.label = f.label;
      field.type = f.type as SurveyFieldType;
      field.required = f.required;
      field.sortOrder = f.sortOrder;

      if (f.options) {
        field.options = f.options.map((o) => {
          const opt = new SurveyFieldOption();
          opt.value = o.value;
          opt.label = o.label;
          opt.sortOrder = o.sortOrder;
          return opt;
        });
      }
      return field;
    });

    const survey = new Survey({
      title: request.title,
      description: request.description,
      createdBy: request.createdBy,
      isPublished: false, // Default to draft
      fields: fields,
    });

    return this.surveyRepository.save(survey);
  }
}

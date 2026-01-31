import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { IUseCase } from "@shared/interfaces";
import type { ISubmissionRepository } from "../interfaces";
import type { ISurveyRepository } from "@modules/surveys/application/interfaces"; // Need access to survey definition
import { SurveySubmission, SurveyAnswer } from "../../domain/submission.model";
import { Survey, SurveyFieldType } from "@modules/surveys/domain/survey.model";

export interface SubmitSurveyRequest {
  surveyId: string;
  officerId: string;
  answers: {
    fieldId: string;
    value: any; // Can be string or array (for checkbox)
  }[];
}

@Injectable()
export class SubmitSurveyUseCase implements IUseCase<
  SubmitSurveyRequest,
  SurveySubmission
> {
  constructor(
    @Inject("ISubmissionRepository")
    private readonly submissionRepository: ISubmissionRepository,
    @Inject("ISurveyRepository")
    private readonly surveyRepository: ISurveyRepository,
  ) {}

  async execute(request: SubmitSurveyRequest): Promise<SurveySubmission> {
    const survey = await this.surveyRepository.findByIdWithFields(
      request.surveyId,
    );
    if (!survey) {
      throw new NotFoundException("Survey not found");
    }

    if (!survey.isPublished) {
      throw new BadRequestException("Survey is not published");
    }

    // Validation Logic
    this.validateAnswers(survey, request.answers);

    // Map to Domain
    const answers = request.answers.map((a) => {
      const field = survey.fields?.find((f) => f.id === a.fieldId);
      const answer = new SurveyAnswer();
      answer.fieldId = a.fieldId;

      if (
        field?.type === SurveyFieldType.CHECKBOX ||
        field?.type === SurveyFieldType.SELECT
      ) {
        // Store multi-select or structured data in JSON
        // Actually SELECT is usually single unless 'multiple', but here assuming flexibility
        // If checkbox, array. If select, string or array.
        // Storing in JSON is safer for structured.
        if (field.type === SurveyFieldType.CHECKBOX) {
          answer.valueJson = a.value;
        } else {
          // For Radio/Select (single), store in Text or JSON? Plan said JSON for structured.
          // Ideally Radio/Select (Single) -> Text. Checkbox/Multi -> JSON.
          // But requirements say "Store multi-select/checkbox as JSON array in value_json".
          // So Radio/Select can be text.
          if (Array.isArray(a.value)) {
            answer.valueJson = a.value;
          } else {
            answer.valueText = String(a.value);
          }
        }
      } else {
        answer.valueText = String(a.value);
      }
      return answer;
    });

    const submission = new SurveySubmission();
    submission.surveyId = survey.id;
    submission.officerId = request.officerId;
    submission.answers = answers;

    return this.submissionRepository.save(submission);
  }

  private validateAnswers(
    survey: Survey,
    answers: SubmitSurveyRequest["answers"],
  ) {
    if (!survey.fields) return;

    for (const field of survey.fields) {
      const answer = answers.find((a) => a.fieldId === field.id);

      // 1. Required Check
      if (
        field.required &&
        (!answer ||
          answer.value === null ||
          answer.value === "" ||
          (Array.isArray(answer.value) && answer.value.length === 0))
      ) {
        throw new BadRequestException(`Field '${field.label}' is required`);
      }

      if (!answer) continue; // Optional and missing is OK

      // 2. Options Check
      if (
        [
          SurveyFieldType.RADIO,
          SurveyFieldType.SELECT,
          SurveyFieldType.CHECKBOX,
        ].includes(field.type)
      ) {
        if (!field.options) continue;
        const validValues = new Set(field.options.map((o) => o.value));

        const valuesToCheck = Array.isArray(answer.value)
          ? answer.value
          : [answer.value];

        for (const val of valuesToCheck) {
          if (!validValues.has(String(val))) {
            throw new BadRequestException(
              `Invalid value '${val}' for field '${field.label}'`,
            );
          }
        }
      }
    }
  }
}

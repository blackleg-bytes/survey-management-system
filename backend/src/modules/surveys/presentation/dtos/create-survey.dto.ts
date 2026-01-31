import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { SurveyFieldType } from "../../domain/survey.model";

const surveyFieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  sortOrder: z.number().int(),
});

const surveyFieldSchema = z.object({
  label: z.string().min(1),
  type: z.nativeEnum(SurveyFieldType),
  required: z.boolean(),
  sortOrder: z.number().int(),
  options: z.array(surveyFieldOptionSchema).optional(),
});

const createSurveySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  fields: z.array(surveyFieldSchema).min(1),
});

export class CreateSurveyDto extends createZodDto(createSurveySchema) {}

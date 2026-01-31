import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const answerSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.union([z.string(), z.array(z.string())]), // Allow string or array of strings (for checkbox)
});

const submitSurveySchema = z.object({
  answers: z.array(answerSchema).min(1),
});

export class SubmitSurveyDto extends createZodDto(submitSurveySchema) {}

export class SurveyAnswer {
  id!: string;
  fieldId!: string;
  valueText?: string;
  valueJson?: any; // For checkbox/select multiple
}

export class SurveySubmission {
  id!: string;
  surveyId!: string;
  officerId!: string;
  submittedAt!: Date;
  answers!: SurveyAnswer[];
}

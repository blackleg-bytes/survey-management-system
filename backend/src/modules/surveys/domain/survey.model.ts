export enum SurveyFieldType {
  TEXT = "text",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SELECT = "select",
}

export class SurveyFieldOption {
  id!: string;
  value!: string;
  label!: string;
  sortOrder!: number;
}

export class SurveyField {
  id!: string;
  surveyId!: string;
  label!: string;
  type!: SurveyFieldType;
  required!: boolean;
  sortOrder!: number;
  options?: SurveyFieldOption[];
}

export class Survey {
  id!: string;
  title!: string;
  description?: string;
  isPublished!: boolean;
  createdBy!: string;
  createdAt!: Date;
  updatedAt!: Date;
  fields?: SurveyField[];

  constructor(props: Partial<Survey>) {
    Object.assign(this, props);
  }
}

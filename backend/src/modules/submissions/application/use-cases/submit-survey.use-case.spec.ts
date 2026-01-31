import { Test, TestingModule } from "@nestjs/testing";
import { SubmitSurveyUseCase } from "./submit-survey.use-case";
import { BadRequestException } from "@nestjs/common";
import { SurveyFieldType, Survey } from "@modules/surveys/domain/survey.model";

describe("SubmitSurveyUseCase", () => {
  let useCase: SubmitSurveyUseCase;
  let submissionRepository: any;
  let surveyRepository: any;

  const mockSurvey = new Survey({
    id: "survey-1",
    isPublished: true,
    fields: [
      {
        id: "field-1",
        label: "Name",
        type: SurveyFieldType.TEXT,
        required: true,
        sortOrder: 1,
        surveyId: "survey-1",
      },
      {
        id: "field-2",
        label: "Choice",
        type: SurveyFieldType.RADIO,
        required: true,
        options: [
          { id: "opt-1", value: "A", label: "A", sortOrder: 1 },
          { id: "opt-2", value: "B", label: "B", sortOrder: 2 },
        ],
        sortOrder: 2,
        surveyId: "survey-1",
      },
    ],
  });

  beforeEach(async () => {
    submissionRepository = {
      save: jest
        .fn()
        .mockImplementation((s) => Promise.resolve({ ...s, id: "sub-1" })),
    };
    surveyRepository = {
      findByIdWithFields: jest.fn().mockResolvedValue(mockSurvey),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmitSurveyUseCase,
        { provide: "ISubmissionRepository", useValue: submissionRepository },
        { provide: "ISurveyRepository", useValue: surveyRepository },
      ],
    }).compile();

    useCase = module.get<SubmitSurveyUseCase>(SubmitSurveyUseCase);
  });

  it("should submit valid answers", async () => {
    const request = {
      surveyId: "survey-1",
      officerId: "officer-1",
      answers: [
        { fieldId: "field-1", value: "John" },
        { fieldId: "field-2", value: "A" },
      ],
    };

    const result = await useCase.execute(request);
    expect(result.id).toBe("sub-1");
    expect(submissionRepository.save).toHaveBeenCalled();
  });

  it("should fail if required field missing", async () => {
    const request = {
      surveyId: "survey-1",
      officerId: "officer-1",
      answers: [{ fieldId: "field-2", value: "A" }],
    };

    await expect(useCase.execute(request)).rejects.toThrow(BadRequestException);
  });

  it("should fail if invalid option provided", async () => {
    const request = {
      surveyId: "survey-1",
      officerId: "officer-1",
      answers: [
        { fieldId: "field-1", value: "John" },
        { fieldId: "field-2", value: "C" }, // Invalid option
      ],
    };

    await expect(useCase.execute(request)).rejects.toThrow(BadRequestException);
  });
});

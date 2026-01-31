import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { SurveyEntity, SurveyFieldEntity } from "./survey.entity";

@Entity("survey_submissions")
export class SurveySubmissionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "survey_id" })
  surveyId!: string;

  @ManyToOne(() => SurveyEntity)
  @JoinColumn({ name: "survey_id" })
  survey!: SurveyEntity;

  @Column({ name: "officer_id" })
  officerId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "officer_id" })
  officer!: UserEntity;

  @CreateDateColumn({ name: "submitted_at" })
  submittedAt!: Date;

  @OneToMany(() => SurveyAnswerEntity, (answer) => answer.submission, {
    cascade: true,
  })
  answers!: SurveyAnswerEntity[];
}

@Entity("survey_answers")
export class SurveyAnswerEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "submission_id" })
  submissionId!: string;

  @ManyToOne(() => SurveySubmissionEntity, (submission) => submission.answers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "submission_id" })
  submission!: SurveySubmissionEntity;

  @Column({ name: "field_id" })
  fieldId!: string;

  @ManyToOne(() => SurveyFieldEntity)
  @JoinColumn({ name: "field_id" })
  field!: SurveyFieldEntity;

  @Column({ name: "value_text", nullable: true, type: "text" })
  valueText!: string | null;

  @Column({ name: "value_json", nullable: true, type: "jsonb" })
  valueJson!: any | null;
}

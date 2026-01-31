import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SurveyFieldType } from "../../../modules/surveys/domain/survey.model";
import { UserEntity } from "./user.entity";

@Entity("surveys")
export class SurveyEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: false, name: "is_published" })
  isPublished!: boolean;

  @Column({ name: "created_by" })
  createdBy!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "created_by" })
  creator!: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => SurveyFieldEntity, (field) => field.survey, {
    cascade: true,
  })
  fields!: SurveyFieldEntity[];
}

@Entity("survey_fields")
export class SurveyFieldEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "survey_id" })
  surveyId!: string;

  @ManyToOne(() => SurveyEntity, (survey) => survey.fields, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "survey_id" })
  survey!: SurveyEntity;

  @Column()
  label!: string;

  @Column({ type: "enum", enum: SurveyFieldType })
  type!: SurveyFieldType;

  @Column({ default: false })
  required!: boolean;

  @Column({ name: "sort_order", default: 0 })
  sortOrder!: number;

  @OneToMany(() => SurveyFieldOptionEntity, (option) => option.field, {
    cascade: true,
    eager: true,
  })
  options!: SurveyFieldOptionEntity[];
}

@Entity("survey_field_options")
export class SurveyFieldOptionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "field_id" })
  fieldId!: string;

  @ManyToOne(() => SurveyFieldEntity, (field) => field.options, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "field_id" })
  field!: SurveyFieldEntity;

  @Column()
  value!: string;

  @Column()
  label!: string;

  @Column({ name: "sort_order", default: 0 })
  sortOrder!: number;
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1769849010686 implements MigrationInterface {
  name = "InitialSchema1769849010686";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'OFFICER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'OFFICER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "surveys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "is_published" boolean NOT NULL DEFAULT false, "created_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1b5e3d4aaeb2321ffa98498c971" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."survey_fields_type_enum" AS ENUM('text', 'checkbox', 'radio', 'select')`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey_fields" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "survey_id" uuid NOT NULL, "label" character varying NOT NULL, "type" "public"."survey_fields_type_enum" NOT NULL, "required" boolean NOT NULL DEFAULT false, "sort_order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_48a986ab67f104244ab56d0a133" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey_field_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "field_id" uuid NOT NULL, "value" character varying NOT NULL, "label" character varying NOT NULL, "sort_order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_27409400d5148af4c2a8a5faad5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey_submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "survey_id" uuid NOT NULL, "officer_id" uuid NOT NULL, "submitted_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c44889594bc576b9a407e8361a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "survey_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submission_id" uuid NOT NULL, "field_id" uuid NOT NULL, "value_text" text, "value_json" jsonb, CONSTRAINT "PK_e4cab112318f766c93435f77a1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "surveys" ADD CONSTRAINT "FK_b395d649c64d92997cb33f4d572" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_fields" ADD CONSTRAINT "FK_440784dbe9210e55a6e6595bab7" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_field_options" ADD CONSTRAINT "FK_2132fe7205119e6cbd779b941af" FOREIGN KEY ("field_id") REFERENCES "survey_fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_submissions" ADD CONSTRAINT "FK_1d00a77c83ec7b4d74e4ee34012" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_submissions" ADD CONSTRAINT "FK_2faba7a333e99f4e18bbdfc31f4" FOREIGN KEY ("officer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_answers" ADD CONSTRAINT "FK_dc12718a9f8ae8a4804ca6643fa" FOREIGN KEY ("submission_id") REFERENCES "survey_submissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_answers" ADD CONSTRAINT "FK_4b7a2d0ce564a8d3f6ed314a5cc" FOREIGN KEY ("field_id") REFERENCES "survey_fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "survey_answers" DROP CONSTRAINT "FK_4b7a2d0ce564a8d3f6ed314a5cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_answers" DROP CONSTRAINT "FK_dc12718a9f8ae8a4804ca6643fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_submissions" DROP CONSTRAINT "FK_2faba7a333e99f4e18bbdfc31f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_submissions" DROP CONSTRAINT "FK_1d00a77c83ec7b4d74e4ee34012"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_field_options" DROP CONSTRAINT "FK_2132fe7205119e6cbd779b941af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "survey_fields" DROP CONSTRAINT "FK_440784dbe9210e55a6e6595bab7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "surveys" DROP CONSTRAINT "FK_b395d649c64d92997cb33f4d572"`,
    );
    await queryRunner.query(`DROP TABLE "survey_answers"`);
    await queryRunner.query(`DROP TABLE "survey_submissions"`);
    await queryRunner.query(`DROP TABLE "survey_field_options"`);
    await queryRunner.query(`DROP TABLE "survey_fields"`);
    await queryRunner.query(`DROP TYPE "public"."survey_fields_type_enum"`);
    await queryRunner.query(`DROP TABLE "surveys"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}

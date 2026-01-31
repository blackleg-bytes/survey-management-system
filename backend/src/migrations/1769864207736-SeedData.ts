import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedData1769864207736 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Users (password_hash is bcrypt hash of 'password')
    await queryRunner.query(`
            INSERT INTO "users" ("id", "email", "password_hash", "role") VALUES 
            ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@example.com', '$2b$10$Yi/q/nrkTWzdZJPP1ym/IuDk01mkCec4MuQ.a/h.IBSfga1bZf0/K', 'ADMIN'),
            ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'officer@example.com', '$2b$10$Yi/q/nrkTWzdZJPP1ym/IuDk01mkCec4MuQ.a/h.IBSfga1bZf0/K', 'OFFICER');
        `);

    // 2. Survey
    await queryRunner.query(`
            INSERT INTO "surveys" ("id", "title", "description", "is_published", "created_by") VALUES 
            ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'City Services Satisfaction Survey', 'A survey to collect feedback on community services and infrastructure.', true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
        `);

    // 3. Survey Fields
    await queryRunner.query(`
            INSERT INTO "survey_fields" ("id", "survey_id", "label", "type", "required", "sort_order") VALUES 
            ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'How satisfied are you with public transport?', 'radio', true, 1),
            ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Additional comments or suggestions', 'text', false, 2);
        `);

    // 4. Field Options
    await queryRunner.query(`
            INSERT INTO "survey_field_options" ("id", "field_id", "value", "label", "sort_order") VALUES 
            ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '5', 'Very Satisfied', 1),
            ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '3', 'Neutral', 2),
            ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '1', 'Very Dissatisfied', 3);
        `);

    // 5. Sample Submission
    await queryRunner.query(`
            INSERT INTO "survey_submissions" ("id", "survey_id", "officer_id") VALUES 
            ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12');
        `);

    // 6. Sample Answers
    await queryRunner.query(`
            INSERT INTO "survey_answers" ("id", "submission_id", "field_id", "value_text") VALUES 
            (uuid_generate_v4(), '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '5'),
            (uuid_generate_v4(), '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Public transport is great, but more frequent weekend services would be appreciated.');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "users" WHERE "id" IN ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12')`,
    );
    await queryRunner.query(
      `DELETE FROM "surveys" WHERE "id" = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'`,
    );
    // Cascades will handle fields, options, submissions, and answers due to CASCADE onDelete
  }
}

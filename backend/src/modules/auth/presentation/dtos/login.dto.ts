import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().describe("User email address"),
  password: z.string().min(6).describe("User password"),
});

export class LoginDto extends createZodDto(loginSchema) {}

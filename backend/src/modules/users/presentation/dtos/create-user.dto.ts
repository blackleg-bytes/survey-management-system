import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { UserRole } from "../../domain/user.model";

export const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole).default(UserRole.OFFICER),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

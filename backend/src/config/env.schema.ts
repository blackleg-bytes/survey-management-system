import { z } from "zod";

export const envSchema = z.object({
  // 🌐 App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  APP_PORT: z.coerce.number().default(3000),
  APP_TIMEOUT: z.coerce.number().default(30000),

  APP_CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((val) => val.split(",").map((v) => v.trim())),

  // 🗃️ Database
  DATABASE_URL: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables");
    console.error(parsed.error.format());
    process.exit(1);
  }

  return parsed.data;
}

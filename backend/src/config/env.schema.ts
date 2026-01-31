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

  JWT_SECRET: z.string().min(1),

  ACCESS_TOKEN_TTL: z.coerce.number().default(900), // seconds (15m)
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),

  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().min(1),

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

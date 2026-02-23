import { z } from "zod"

const envSchema = z.object({
  MONGODB_URI: z.string().url().optional(),
  MONGODB_DB: z.string().default("prayer_times_app"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Prayer Times PWA"),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string(),
  VAPID_PRIVATE_KEY: z.string(),
  VAPID_EMAIL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format())
  throw new Error("Invalid environment variables")
}

export const env = _env.data

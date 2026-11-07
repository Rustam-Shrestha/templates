import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1024).max(65535).default(4000),
  SERVICE_VERSION: z.string().default("1.0.0"),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  DATABASE_WRITE_URL: z.url(),
  DATABASE_READ_URL: z.url(),
  DATABASE_POOL_MAX: z.coerce.number().int().min(2).max(100).default(25),
  REDIS_URL: z.url(),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((v) => v.split(","))
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv !== null) return cachedEnv;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const errorDetails =
      typeof (z as unknown as { prettifyError?: (err: unknown) => string }).prettifyError === "function"
        ? (z as unknown as { prettifyError: (err: unknown) => string }).prettifyError(parsed.error)
        : JSON.stringify(parsed.error.format());
    process.stderr.write(`FATAL_BOOT_ENV_INVALID: ${errorDetails}\n`);
    process.exit(1);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}


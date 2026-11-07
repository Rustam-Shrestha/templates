import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import type { FastifyRequest } from "fastify";
import { VersioningType } from "@nestjs/common";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { AppModule } from "./app.module.js";
import { getEnv } from "./core/config/env.schema.js";
import { Rfc7807ExceptionFilter } from "./core/resilience/rfc7807-exception.filter.js";
import { createLogger } from "@workspace/logger";

async function bootstrap(): Promise<void> {
  const env = getEnv();
  const logger = createLogger("erp-backend");

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: env.TRUST_PROXY_HOPS, // §1.6: 0 = never trust spoofed proxy headers
      bodyLimit: 1_048_576 // 1MB strict payload limit (§7)
    })
  );

  // Security headers & rate limiting (§2.4, §4.5)
  type RegisterPlugin = Parameters<NestFastifyApplication["register"]>[0];
  await app.register(helmet as unknown as RegisterPlugin);
  await app.register(rateLimit as unknown as RegisterPlugin, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: (_req: FastifyRequest, context: { after: string }) => ({
      type: "https://httpstatuses.com/429",
      title: "Too Many Requests",
      status: 429,
      detail: `Rate limit exceeded. Try again in ${context.after}.`,
      instance: _req.url,
      correlationId: (_req.headers["x-correlation-id"] as string) ?? "rate-limit-exceeded",
      timestamp: new Date().toISOString()
    })
  });

  app.enableCors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true
  });

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });

  app.useGlobalFilters(new Rfc7807ExceptionFilter());
  app.enableShutdownHooks();

  // §7 Graceful shutdown with 10s force-exit timeout
  const handleShutdown = (): void => {
    logger.info("Initiating graceful shutdown (10s force timeout)...");
    const forceExitTimer = setTimeout(() => {
      logger.error("Graceful shutdown timed out. Forcing process exit.");
      process.exit(1);
    }, 10_000);
    forceExitTimer.unref();
  };
  process.on("SIGTERM", handleShutdown);
  process.on("SIGINT", handleShutdown);

  await app.init();
  await app.listen(env.PORT, "0.0.0.0");
  logger.info({ port: env.PORT, env: env.NODE_ENV }, "ERP Fastify Backend Online");
}

void bootstrap();


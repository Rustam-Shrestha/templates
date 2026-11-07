import { pino, type Logger, type DestinationStream } from "pino";

export type { Logger };

export function createLogger(serviceName: string, destination?: DestinationStream): Logger {
  return pino(
    {
      name: serviceName,
      level: process.env["LOG_LEVEL"] ?? "info",
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "password",
          "token",
          "secret",
          "ssn",
          "pan",
          "user.password",
          "user.token",
          "user.ssn",
          "payload.password",
          "payload.token",
          "payload.ssn",
          "*.password",
          "*.token",
          "*.secret",
          "*.ssn",
          "*.pan"
        ],
        censor: "[REDACTED_PII]"
      },
      formatters: {
        level(label) {
          return { level: label.toUpperCase() };
        }
      },
      timestamp: pino.stdTimeFunctions.isoTime
    },
    destination
  );
}


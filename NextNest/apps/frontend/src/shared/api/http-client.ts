import type { z } from "zod";
import { generateUuidV7 } from "@workspace/contracts";
import { clientEnv } from "./env";

export interface FetchContractOptions<TSchema extends z.ZodTypeAny> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  schema: TSchema;
  idempotencyKey?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

const API_BASE = clientEnv.NEXT_PUBLIC_API_URL;

/**
 * Resilient HTTP Client with AbortController Timeouts, Jittered Exponential Backoff,
 * automatic Idempotency-Key generation on mutations, and runtime Zod contract validation.
 */
export async function fetchWithContract<TSchema extends z.ZodTypeAny>(
  path: string,
  options: FetchContractOptions<TSchema>
): Promise<z.infer<TSchema>> {
  const method = options.method ?? "GET";
  const timeoutMs = options.timeoutMs ?? 8000;
  const maxRetries = method === "GET" ? (options.maxRetries ?? 2) : 0;
  const idempotencyKey =
    options.idempotencyKey ?? (method !== "GET" ? generateUuidV7() : undefined);

  let attempt = 0;

  while (true) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json"
      };
      if (idempotencyKey !== undefined) {
        headers["Idempotency-Key"] = idempotencyKey;
      }

      const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : null,
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (response.status >= 500 && attempt < maxRetries) {
          attempt++;
          const jitterDelay = Math.random() * Math.min(4000, 250 * Math.pow(2, attempt));
          await new Promise((r) => setTimeout(r, jitterDelay));
          continue;
        }
        throw new Error(`API_HTTP_ERROR_${String(response.status)}`);
      }

      const json: unknown = await response.json();
      return options.schema.parse(json);
    } catch (error) {
      clearTimeout(timer);
      if (attempt < maxRetries) {
        attempt++;
        const jitterDelay = Math.random() * Math.min(4000, 250 * Math.pow(2, attempt));
        await new Promise((r) => setTimeout(r, jitterDelay));
        continue;
      }
      throw error;
    }
  }
}


import { Global, Injectable, Module, OnApplicationShutdown } from "@nestjs/common";
import { Redis } from "ioredis";
import { getEnv } from "../config/env.schema.js";
import { createLogger } from "@workspace/logger";

const logger = createLogger("redis-service");

@Injectable()
export class RedisService implements OnApplicationShutdown {
  public readonly client: Redis;
  private readonly inFlight = new Map<string, Promise<unknown>>();

  // Circuit breaker state (§4.3)
  private isCircuitOpen = false;
  private lastCircuitFailureTime = 0;
  private consecutiveFailures = 0;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly RECOVERY_TIMEOUT_MS = 10_000;

  constructor() {
    const env = getEnv();
    this.client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      commandTimeout: 500, // §4.3: 500ms command timeout
      lazyConnect: true,
      enableOfflineQueue: false
    });

    this.client.on("error", (err) => {
      this.recordFailure();
      logger.warn({ err }, "Redis connection error, circuit breaker updated");
    });
  }

  private recordFailure(): void {
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.FAILURE_THRESHOLD) {
      this.isCircuitOpen = true;
      this.lastCircuitFailureTime = Date.now();
      logger.error("Redis Circuit Breaker OPENED. Bypassing cache to protect request lifecycle.");
    }
  }

  private recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.isCircuitOpen = false;
  }

  public shouldBypassCache(): boolean {
    if (!this.isCircuitOpen) return false;
    const elapsed = Date.now() - this.lastCircuitFailureTime;
    if (elapsed > this.RECOVERY_TIMEOUT_MS) {
      // Half-open test
      return false;
    }
    return true;
  }

  /**
   * Process-Local Single-Flight Cache Stampede Protection with +/-10% TTL Jitter (§4.4).
   * Note: Single-flight guarantees collapse of stampedes within this node process instance.
   * If Redis is unreachable or circuit is open, directly computes computeFn() without failing request (§4.3).
   */
  async getOrComputeSingleFlight<T>(
    key: string,
    ttlSeconds: number,
    computeFn: () => Promise<T>
  ): Promise<T> {
    if (this.shouldBypassCache()) {
      return computeFn();
    }

    try {
      const cached = await this.client.get(key);
      if (cached !== null) {
        this.recordSuccess();
        return JSON.parse(cached) as T;
      }
    } catch {
      this.recordFailure();
      return computeFn();
    }

    const activePromise = this.inFlight.get(key);
    if (activePromise !== undefined) {
      return activePromise as Promise<T>;
    }

    const promise = (async (): Promise<T> => {
      try {
        const data = await computeFn();
        const jitter = Math.floor(ttlSeconds * 0.1 * (Math.random() * 2 - 1));
        const effectiveTtl = Math.max(1, ttlSeconds + jitter);
        await this.client
          .setex(key, effectiveTtl, JSON.stringify(data))
          .catch(() => this.recordFailure());
        return data;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  async invalidate(key: string): Promise<void> {
    if (this.shouldBypassCache()) return;
    try {
      await this.client.del(key);
    } catch {
      this.recordFailure();
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client.quit().catch(() => undefined);
  }
}

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}


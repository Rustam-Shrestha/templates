import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
  Inject
} from "@nestjs/common";
import { Observable, from, throwError, of } from "rxjs";
import { switchMap, tap, catchError } from "rxjs/operators";
import { createHash } from "node:crypto";
import type { FastifyRequest, FastifyReply } from "fastify";
import { and, eq } from "drizzle-orm";
import { DB_WRITE, type DbConnection } from "../database/db.module.js";
import { idempotencyKeys } from "../database/schema.js";

function canonicalJsonStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalJsonStringify).join(",") + "]";
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map((k) => `${JSON.stringify(k)}:${canonicalJsonStringify((obj as Record<string, unknown>)[k])}`);
  return "{" + pairs.join(",") + "}";
}

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@Inject(DB_WRITE) private readonly writeConn: DbConnection) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<FastifyRequest>();
    const res = http.getResponse<FastifyReply>();

    // Only apply idempotency to mutation methods
    const method = req.method.toUpperCase();
    if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
      return next.handle();
    }

    const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
    if (!idempotencyKey || idempotencyKey.trim() === "") {
      throw new BadRequestException("IDEMPOTENCY_KEY_REQUIRED");
    }

    const scope = `${method} ${req.url.split("?")[0]}`;
    const requestHash = createHash("sha256")
      .update(canonicalJsonStringify(req.body ?? {}))
      .digest("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours TTL

    return from(
      this.writeConn.db
        .insert(idempotencyKeys)
        .values({
          scope,
          key: idempotencyKey,
          requestHash,
          status: "IN_PROGRESS",
          createdAt: new Date(),
          expiresAt
        })
        .onConflictDoNothing()
    ).pipe(
      switchMap(() =>
        from(
          this.writeConn.db
            .select()
            .from(idempotencyKeys)
            .where(
              and(
                eq(idempotencyKeys.scope, scope),
                eq(idempotencyKeys.key, idempotencyKey)
              )
            )
            .limit(1)
        )
      ),
      switchMap((rows) => {
        const row = rows[0];
        if (!row) {
          return throwError(() => new ConflictException("IDEMPOTENCY_CONCURRENCY_ERROR"));
        }

        // Conflict check
        if (row.requestHash !== requestHash) {
          return throwError(() => new UnprocessableEntityException("IDEMPOTENCY_KEY_REUSED"));
        }

        if (row.status === "COMPLETED") {
          void res.status(row.responseStatus ?? 200);
          return of(row.responseBody);
        }

        // Check if row is currently IN_PROGRESS by another request
        // (If created just now by us, row.status is IN_PROGRESS and we continue to handle)
        return next.handle().pipe(
          tap({
            next: (data) => {
              const status = res.statusCode || 201;
              void this.writeConn.db
                .update(idempotencyKeys)
                .set({
                  status: "COMPLETED",
                  responseStatus: status,
                  responseBody: data
                })
                .where(
                  and(
                    eq(idempotencyKeys.scope, scope),
                    eq(idempotencyKeys.key, idempotencyKey)
                  )
                );
            },
            error: () => {
              // Delete IN_PROGRESS row on failure so the client can retry (§4.1 step 5)
              void this.writeConn.db
                .delete(idempotencyKeys)
                .where(
                  and(
                    eq(idempotencyKeys.scope, scope),
                    eq(idempotencyKeys.key, idempotencyKey)
                  )
                );
            }
          })
        );
      }),
      catchError((err) => {
        if (
          err instanceof ConflictException ||
          err instanceof UnprocessableEntityException ||
          err instanceof BadRequestException
        ) {
          if (err instanceof ConflictException) {
            void res.header("Retry-After", "1");
          }
          return throwError(() => err);
        }
        return throwError(() => err);
      })
    );
  }
}


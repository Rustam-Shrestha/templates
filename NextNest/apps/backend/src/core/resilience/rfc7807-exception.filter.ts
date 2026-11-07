import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { generateUuidV7, type ProblemDetails } from "@workspace/contracts";
import { createLogger } from "@workspace/logger";

const logger = createLogger("exception-filter");

@Catch()
export class Rfc7807ExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const correlationId =
      (request.headers["x-correlation-id"] as string | undefined) ?? generateUuidV7();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = "Internal Server Error";
    let detail = "An internal server error occurred. Please contact support with the correlation ID.";

    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      title = "Validation Failed";
      detail = exception.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      title = exception.name;
      const resp = exception.getResponse();
      detail =
        typeof resp === "object" && resp !== null && "message" in resp
          ? Array.isArray((resp as { message: unknown }).message)
            ? ((resp as { message: unknown[] }).message).join("; ")
            : String((resp as { message: unknown }).message)
          : exception.message;
    } else if (exception instanceof Error) {
      // Unknown internal error - log full error with correlationId, NEVER leak exception.message (§2.2)
      logger.error(
        { err: exception, correlationId, url: request.url, method: request.method },
        "Internal Runtime Exception"
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      title = "Internal Server Error";
      detail = "An internal server error occurred. Please contact support with the correlation ID.";
    }

    const problem: ProblemDetails = {
      type: `https://httpstatuses.com/${status}`,
      title,
      status,
      detail,
      instance: request.url,
      correlationId,
      timestamp: new Date().toISOString()
    };

    void reply.status(status).header("content-type", "application/problem+json").send(problem);
  }
}


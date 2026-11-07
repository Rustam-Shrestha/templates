import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { type ZodTypeAny, ZodError } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodTypeAny) {}

  transform(value: unknown): unknown {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw error;
      }
      throw new BadRequestException("Validation failed");
    }
  }
}


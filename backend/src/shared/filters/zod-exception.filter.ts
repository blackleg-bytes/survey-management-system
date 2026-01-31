// common/filters/zod-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { ZodValidationException } from "nestjs-zod";
import { Response, Request } from "express";
import { ZodError } from "zod";

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>(); // Need request for path

    const zodError = exception.getZodError() as ZodError;

    // Format errors to be frontend-friendly (Map: "field.path" -> "Message")
    const formattedErrors: Record<string, string> = {};

    for (const issue of zodError.issues) {
      const path = issue.path.join(".") || "root"; // Handle root-level errors
      // Use the first error message for a given field
      if (!formattedErrors[path]) {
        formattedErrors[path] = issue.message;
      }
    }

    return response.status(400).json({
      success: false,
      message: "Validation failed",
      statusCode: 400,
      data: null,
      errors: formattedErrors,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

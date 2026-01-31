import { Injectable, PipeTransform } from "@nestjs/common";

/**
 * Trims whitespace from string values
 * Supports nested objects & arrays
 */
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === "string") {
      return value.trim();
    }

    if (typeof value === "object" && value !== null) {
      return this.trimObject(value as Record<string, unknown>);
    }

    return value;
  }

  private trimObject(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        result[key] = value.trim();
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          typeof item === "string"
            ? item.trim()
            : typeof item === "object" && item !== null
              ? this.trimObject(item as Record<string, unknown>)
              : item,
        );
      } else if (typeof value === "object" && value !== null) {
        result[key] = this.trimObject(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}

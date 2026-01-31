import { Injectable, PipeTransform } from "@nestjs/common";

/**
 * Safely parses an integer
 * Returns default value if invalid
 */
@Injectable()
export class ParseIntDefaultPipe implements PipeTransform {
  constructor(private readonly defaultValue: number) {}

  transform(value: unknown): number {
    if (value === undefined || value === null || value === "") {
      return this.defaultValue;
    }

    const parsed = Number.parseInt(String(value), 10);
    return Number.isNaN(parsed) ? this.defaultValue : parsed;
  }
}

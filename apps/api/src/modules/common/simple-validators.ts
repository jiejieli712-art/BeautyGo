import { BadRequestException } from "@nestjs/common";

export function assertString(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new BadRequestException(`${fieldName} must be a string`);
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new BadRequestException(`${fieldName} cannot be empty`);
  }

  return normalized;
}

export function assertOptionalString(
  value: unknown,
  fieldName: string
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return assertString(value, fieldName);
}

export function assertNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new BadRequestException(`${fieldName} must be a finite number`);
  }

  return value;
}

export function assertInteger(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number }
): number {
  const numberValue = assertNumber(value, fieldName);

  if (!Number.isInteger(numberValue)) {
    throw new BadRequestException(`${fieldName} must be an integer`);
  }

  if (options?.min !== undefined && numberValue < options.min) {
    throw new BadRequestException(
      `${fieldName} must be greater than or equal to ${options.min}`
    );
  }

  if (options?.max !== undefined && numberValue > options.max) {
    throw new BadRequestException(
      `${fieldName} must be less than or equal to ${options.max}`
    );
  }

  return numberValue;
}

export function assertArray(value: unknown, fieldName: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new BadRequestException(`${fieldName} must be an array`);
  }

  return value;
}

export function assertOneOf<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): T {
  const normalized = assertString(value, fieldName);
  const isAllowed = allowedValues.includes(normalized as T);

  if (!isAllowed) {
    throw new BadRequestException(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`
    );
  }

  return normalized as T;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

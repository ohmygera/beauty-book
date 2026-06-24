// E.164: optional leading +, first digit 1-9, then up to 14 more digits
export const E164_REGEX = /^\+?[1-9]\d{1,14}$/;

export function validatePhone(value: string): string | null {
  const cleaned = value.replace(/[\s()-]/g, "");
  if (!cleaned) return "Phone number is required";
  if (!E164_REGEX.test(cleaned)) {
    return "Use international format — e.g. +79991234567";
  }
  return null;
}

/** Strip characters that can never appear in a valid phone entry */
export function sanitizePhone(value: string): string {
  return value.replace(/[^\d+\s()\-]/g, "");
}

export function validateFullName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Full name is required";
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  return null;
}
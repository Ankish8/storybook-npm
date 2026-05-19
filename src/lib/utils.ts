import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Collapses runs of the space character (U+0020) so only a single space remains between segments.
 * Newlines and other whitespace are unchanged.
 */
export function normalizeTextareaSpaces(value: string): string {
  return String(value).replace(/ {2,}/g, " ");
}

/**
 * Length after {@link normalizeTextareaSpaces}: letters, digits, newlines, tabs, and single
 * spaces each count once; duplicate spaces do not add to the total.
 */
export function countNormalizedTextLength(value: string): number {
  return normalizeTextareaSpaces(value).length;
}

/**
 * Length of the string with all Unicode whitespace removed (spaces, tabs, newlines, etc.).
 * Use for character counters and minimum-length rules where whitespace should not use the budget.
 */
export function countNonWhitespaceChars(value: string): number {
  return String(value).replace(/\s/g, "").length;
}

/** Truncates a string to at most `maxLength` characters (Unicode code units). */
export function clampToMaxLength(value: string, maxLength: number): string {
  if (maxLength < 0) return String(value);
  return String(value).slice(0, maxLength);
}

/**
 * Normalizes duplicate spaces and truncates so {@link countNormalizedTextLength} is at most
 * `maxLength`.
 */
export function clampToMaxNormalizedTextLength(
  value: string,
  maxLength: number
): string {
  if (maxLength < 0) return String(value);
  const normalized = normalizeTextareaSpaces(value);
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength);
}

/**
 * Keeps whitespace as-is but drops non-whitespace characters after `maxNonWhitespace`
 * have been collected. Use with {@link countNonWhitespaceChars} for counters and limits.
 */
export function clampToMaxNonWhitespaceChars(
  value: string,
  maxNonWhitespace: number
): string {
  if (maxNonWhitespace < 0) return String(value);
  let nonWs = 0;
  let out = "";
  for (const ch of String(value)) {
    if (/\s/.test(ch)) {
      out += ch;
      continue;
    }
    if (nonWs >= maxNonWhitespace) continue;
    nonWs += 1;
    out += ch;
  }
  return out;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Length of the string with all Unicode whitespace removed (spaces, tabs, newlines, etc.).
 * Use for character counters and minimum-length rules where whitespace should not use the budget.
 */
export function countNonWhitespaceChars(value: string): number {
  return String(value).replace(/\s/g, "").length;
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

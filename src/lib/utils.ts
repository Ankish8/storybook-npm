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

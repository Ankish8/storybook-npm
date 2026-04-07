/** Shown when the user enters digits, symbols, or other disallowed characters. */
export const BOT_IDENTITY_INVALID_CHARS_MESSAGE =
  "Invalid characters not allowed.";

/**
 * Keeps only ASCII letters and spaces (A–Z, a–z, space). Used for Bot Name, Primary Role, and Tone.
 */
export function filterBotIdentityText(input: string): string {
  return input.replace(/[^A-Za-z ]/g, "");
}

export function hadInvalidBotIdentityChars(
  raw: string,
  filtered: string
): boolean {
  return raw !== filtered;
}

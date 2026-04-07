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

/** Collapses runs of spaces to a single space. */
export function collapseConsecutiveSpaces(input: string): string {
  return input.replace(/ +/g, " ");
}

/**
 * Length for counters and max-length checks: leading/trailing spaces are ignored,
 * and consecutive spaces count as one.
 */
export function botIdentityEffectiveValueLength(input: string): number {
  return collapseConsecutiveSpaces(input).trim().length;
}

/**
 * Final stored value: filter, single spaces only, full trim.
 * Do not use on preset option values that contain hyphens (e.g. customer-support).
 */
export function finalizeBotIdentityFieldValue(raw: string): string {
  return collapseConsecutiveSpaces(filterBotIdentityText(raw)).trim();
}

/**
 * While typing: strip leading spaces, collapse doubles, enforce max on trimmed length;
 * a single trailing space is kept so the user can type the next word.
 */
export function normalizeFilteredBotIdentityTyping(
  filtered: string,
  maxLength: number
): string {
  const collapsed = collapseConsecutiveSpaces(filtered).replace(/^\s+/, "");
  const trimmedAll = collapsed.trim();
  if (trimmedAll.length > maxLength) {
    return trimmedAll.slice(0, maxLength);
  }
  return collapsed;
}

export function sanitizeBotIdentityFieldTyping(
  raw: string,
  maxLength: number
): string {
  return normalizeFilteredBotIdentityTyping(
    filterBotIdentityText(raw),
    maxLength
  );
}

import { BOT_IDENTITY_INVALID_CHARS_MESSAGE } from "./bot-identity-text";

/** Same copy as Bot Name identity fields — shown under prompt-style textareas when disallowed characters are present. */
export const PROMPT_INVALID_CHARS_MESSAGE = BOT_IDENTITY_INVALID_CHARS_MESSAGE;

/**
 * Disallows ASCII control characters except tab, LF, and CR (newlines).
 * Matches product expectation for free-text bot prompts and messages.
 */
export function hasInvalidPromptFieldChars(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c === 0x09 || c === 0x0a || c === 0x0d) continue;
    if (c < 0x20 || c === 0x7f) return true;
  }
  return false;
}

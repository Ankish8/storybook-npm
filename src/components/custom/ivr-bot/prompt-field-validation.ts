import { BOT_IDENTITY_INVALID_CHARS_MESSAGE } from "./bot-identity-text";

/** Same copy as Bot Name identity fields — shown under prompt-style textareas when disallowed characters are present. */
export const PROMPT_INVALID_CHARS_MESSAGE = BOT_IDENTITY_INVALID_CHARS_MESSAGE;

/**
 * Disallows ASCII control characters except tab, LF, and CR (newlines).
 * Matches product expectation for free-text bot prompts and messages.
 */
function isDisallowedControlChar(code: number): boolean {
  if (code === 0x09 || code === 0x0a || code === 0x0d) return false; // tab, LF, CR
  if (code < 0x20 || code === 0x7f) return true;
  return false;
}

export function hasInvalidPromptFieldChars(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    if (isDisallowedControlChar(value.charCodeAt(i))) return true;
  }
  return false;
}

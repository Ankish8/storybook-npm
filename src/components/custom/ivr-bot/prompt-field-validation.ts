import { BOT_IDENTITY_INVALID_CHARS_MESSAGE } from "./bot-identity-text";

/** Same copy as Bot Name identity fields — shown under prompt-style textareas when disallowed characters are present. */
export const PROMPT_INVALID_CHARS_MESSAGE = BOT_IDENTITY_INVALID_CHARS_MESSAGE;

/**
 * Disallows ASCII control characters except tab, LF, and CR (newlines).
 * Matches product expectation for free-text bot prompts and messages.
 */
const DISALLOWED_PROMPT_CONTROLS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

export function hasInvalidPromptFieldChars(value: string): boolean {
  return DISALLOWED_PROMPT_CONTROLS.test(value);
}

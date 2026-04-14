import { describe, it, expect } from "vitest";
import {
  hasInvalidPromptFieldChars,
  PROMPT_INVALID_CHARS_MESSAGE,
} from "../prompt-field-validation";

describe("prompt-field-validation", () => {
  it("returns false for empty string", () => {
    expect(hasInvalidPromptFieldChars("")).toBe(false);
  });

  it("allows newlines and tabs", () => {
    expect(hasInvalidPromptFieldChars("a\nb\tc")).toBe(false);
  });

  it("detects null byte", () => {
    expect(hasInvalidPromptFieldChars("hello\x00")).toBe(true);
  });

  it("uses product copy constant", () => {
    expect(PROMPT_INVALID_CHARS_MESSAGE).toBe("Invalid characters not allowed.");
  });
});

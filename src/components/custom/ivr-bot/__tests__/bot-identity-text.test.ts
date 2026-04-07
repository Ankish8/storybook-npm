import { describe, it, expect } from "vitest";
import {
  filterBotIdentityText,
  hadInvalidBotIdentityChars,
  BOT_IDENTITY_INVALID_CHARS_MESSAGE,
  botIdentityEffectiveValueLength,
  collapseConsecutiveSpaces,
  finalizeBotIdentityFieldValue,
  normalizeFilteredBotIdentityTyping,
  sanitizeBotIdentityFieldTyping,
} from "../bot-identity-text";

describe("bot-identity-text", () => {
  it("exposes the expected user-facing message", () => {
    expect(BOT_IDENTITY_INVALID_CHARS_MESSAGE).toBe(
      "Invalid characters not allowed."
    );
  });

  it("keeps ASCII letters and spaces", () => {
    expect(filterBotIdentityText("Hello World")).toBe("Hello World");
    expect(filterBotIdentityText("aAzZ ")).toBe("aAzZ ");
  });

  it("removes digits and symbols", () => {
    expect(filterBotIdentityText("Rhea@1")).toBe("Rhea");
    expect(filterBotIdentityText("a#b$c")).toBe("abc");
    expect(filterBotIdentityText("test-123")).toBe("test");
  });

  it("detects when filtering removed characters", () => {
    expect(hadInvalidBotIdentityChars("a1", "a")).toBe(true);
    expect(hadInvalidBotIdentityChars("ab", "ab")).toBe(false);
  });

  it("collapses consecutive spaces", () => {
    expect(collapseConsecutiveSpaces("a    b")).toBe("a b");
  });

  it("effective length ignores outer spaces and counts collapsed interior spaces", () => {
    expect(botIdentityEffectiveValueLength("  Rhea    ")).toBe(4);
    expect(botIdentityEffectiveValueLength("Hello  World")).toBe(11);
  });

  it("finalize trims and collapses", () => {
    expect(finalizeBotIdentityFieldValue("  Hi  there  ")).toBe("Hi there");
  });

  it("normalizeFilteredBotIdentityTyping enforces max on trimmed length", () => {
    expect(normalizeFilteredBotIdentityTyping("abcde", 3)).toBe("abc");
  });

  it("sanitizeBotIdentityFieldTyping filters then normalizes", () => {
    expect(sanitizeBotIdentityFieldTyping("  A  B  ", 50)).toBe("A B ");
  });
});

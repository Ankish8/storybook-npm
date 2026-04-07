import { describe, it, expect } from "vitest";
import {
  filterBotIdentityText,
  hadInvalidBotIdentityChars,
  BOT_IDENTITY_INVALID_CHARS_MESSAGE,
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
});

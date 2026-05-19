import { describe, it, expect } from "vitest";
import {
  clampToMaxLength,
  clampToMaxNormalizedTextLength,
  clampToMaxNonWhitespaceChars,
  countNormalizedTextLength,
  countNonWhitespaceChars,
} from "../utils";

describe("countNormalizedTextLength", () => {
  it("counts single spaces and collapses duplicate spaces", () => {
    expect(countNormalizedTextLength("hello  world")).toBe(11);
    expect(countNormalizedTextLength("a".repeat(50) + " " + "a".repeat(49))).toBe(
      100
    );
  });

  it("still counts newlines and tabs", () => {
    expect(countNormalizedTextLength("a\nb\tc")).toBe(5);
  });
});

describe("clampToMaxNormalizedTextLength", () => {
  it("normalizes duplicate spaces and truncates by normalized length", () => {
    expect(clampToMaxNormalizedTextLength("ab  cd", 4)).toBe("ab c");
    expect(countNormalizedTextLength(clampToMaxNormalizedTextLength("ab  cd", 4))).toBe(
      4
    );
  });
});

describe("countNonWhitespaceChars", () => {
  it("returns 0 for whitespace-only strings", () => {
    expect(countNonWhitespaceChars("   \n\t  ")).toBe(0);
  });

  it("strips all whitespace categories and counts the rest", () => {
    expect(countNonWhitespaceChars("a b\nc\td")).toBe(4);
  });
});

describe("clampToMaxLength", () => {
  it("truncates to max length", () => {
    expect(clampToMaxLength("abcdef", 3)).toBe("abc");
  });
});

describe("clampToMaxNonWhitespaceChars", () => {
  it("allows trailing whitespace after the non-whitespace cap is reached", () => {
    expect(clampToMaxNonWhitespaceChars("ab cd", 2)).toBe("ab ");
  });

  it("drops extra non-whitespace characters", () => {
    expect(clampToMaxNonWhitespaceChars("abcd", 2)).toBe("ab");
    expect(countNonWhitespaceChars(clampToMaxNonWhitespaceChars("abcd", 2))).toBe(2);
  });
});

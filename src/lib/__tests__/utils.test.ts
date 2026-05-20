import { describe, it, expect } from "vitest";
import {
  clampToMaxLength,
  clampToMaxNormalizedTextLength,
  countNormalizedTextLength,
} from "../../components/custom/ivr-bot/create-function-validation";

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

describe("clampToMaxLength", () => {
  it("truncates to max length", () => {
    expect(clampToMaxLength("abcdef", 3)).toBe("abc");
  });
});

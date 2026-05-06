import { describe, it, expect } from "vitest";
import { countNonWhitespaceChars } from "../utils";

describe("countNonWhitespaceChars", () => {
  it("returns 0 for whitespace-only strings", () => {
    expect(countNonWhitespaceChars("   \n\t  ")).toBe(0);
  });

  it("strips all whitespace categories and counts the rest", () => {
    expect(countNonWhitespaceChars("a b\nc\td")).toBe(4);
  });
});

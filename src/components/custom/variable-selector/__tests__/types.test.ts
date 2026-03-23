import { describe, it, expect } from "vitest";
import {
  parseValueToSegments,
  segmentsToValue,
  removeLastVariableOrChar,
} from "../types";

describe("parseValueToSegments", () => {
  it("returns empty array for empty string", () => {
    expect(parseValueToSegments("")).toEqual([]);
  });

  it("parses text only", () => {
    expect(parseValueToSegments("hello")).toEqual([{ type: "text", value: "hello" }]);
  });

  it("parses single variable", () => {
    expect(parseValueToSegments("{{Order_id}}")).toEqual([
      { type: "variable", name: "Order_id" },
    ]);
  });

  it("parses text and variable", () => {
    expect(parseValueToSegments("prefix {{var}} suffix")).toEqual([
      { type: "text", value: "prefix " },
      { type: "variable", name: "var" },
      { type: "text", value: " suffix" },
    ]);
  });

  it("parses multiple variables", () => {
    expect(parseValueToSegments("{{a}} and {{b}}")).toEqual([
      { type: "variable", name: "a" },
      { type: "text", value: " and " },
      { type: "variable", name: "b" },
    ]);
  });
});

describe("segmentsToValue", () => {
  it("returns empty string for empty segments", () => {
    expect(segmentsToValue([])).toBe("");
  });

  it("reconstructs value from segments", () => {
    const segments = parseValueToSegments("hello {{Order_id}} world");
    expect(segmentsToValue(segments)).toBe("hello {{Order_id}} world");
  });
});

describe("removeLastVariableOrChar", () => {
  it("returns empty for empty string", () => {
    expect(removeLastVariableOrChar("")).toBe("");
  });

  it("removes last character when no trailing variable", () => {
    expect(removeLastVariableOrChar("hello")).toBe("hell");
    expect(removeLastVariableOrChar("a")).toBe("");
  });

  it("removes trailing space as one character", () => {
    expect(removeLastVariableOrChar("hi ")).toBe("hi");
  });

  it("removes whole trailing variable token", () => {
    expect(removeLastVariableOrChar("text {{var}}")).toBe("text ");
    expect(removeLastVariableOrChar("{{only}}")).toBe("");
    expect(removeLastVariableOrChar("a {{b}} {{c}}")).toBe("a {{b}} ");
  });
});

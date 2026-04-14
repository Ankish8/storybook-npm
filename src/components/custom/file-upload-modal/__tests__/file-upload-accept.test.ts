import { describe, it, expect } from "vitest";
import {
  isFileExtensionAllowed,
  parseAcceptedExtensions,
} from "../file-upload-accept";

const DEFAULT_ACCEPT =
  ".doc,.docx,.pdf,.csv,.xls,.xlsx,.txt";

describe("parseAcceptedExtensions", () => {
  it("parses comma-separated accept string", () => {
    expect(parseAcceptedExtensions(DEFAULT_ACCEPT)).toEqual([
      "doc",
      "docx",
      "pdf",
      "csv",
      "xls",
      "xlsx",
      "txt",
    ]);
  });
});

describe("isFileExtensionAllowed", () => {
  it("rejects all files when accept string parses to no extensions", () => {
    expect(isFileExtensionAllowed("doc.pdf", "")).toBe(false);
    expect(isFileExtensionAllowed("doc.pdf", "  ,  , ")).toBe(false);
  });

  it.each([
    ["report.pdf", true],
    ["notes.DOCX", true],
    ["data.csv", true],
    ["sheet.xls", true],
    ["sheet.xlsx", true],
    ["readme.txt", true],
    ["photo.jpg", false],
    ["photo.jpeg", false],
    ["pic.PNG", false],
    ["audio.wav", false],
    ["song.mp3", false],
    ["noextension", false],
    [".hidden", false],
  ] as const)(
    "for %s returns %s",
    (name, expected) => {
      expect(isFileExtensionAllowed(name, DEFAULT_ACCEPT)).toBe(expected);
    }
  );
});

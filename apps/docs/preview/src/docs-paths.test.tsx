import { afterEach, expect, test, vi } from "vitest";
import { docsPath } from "../../lib/paths";

afterEach(() => vi.unstubAllEnvs());

test("local docs keep root asset and runtime paths", () => {
  vi.stubEnv("NEXT_PUBLIC_DOCS_BASE_PATH", "");
  expect(docsPath("/preview/index.html")).toBe("/preview/index.html");
});

test("deployed iframe, assets, source and redirects stay within the docs mount", () => {
  vi.stubEnv("NEXT_PUBLIC_DOCS_BASE_PATH", "/design-system");
  for (const path of [
    "/preview/index.html",
    "/preview/example.html",
    "/brand/myoperator-symbol.svg",
    "/api/source?slug=button&mode=component",
    "/foundations#typography",
    "/components/select",
  ]) {
    expect(docsPath(path)).toBe(`/design-system${path}`);
  }
});

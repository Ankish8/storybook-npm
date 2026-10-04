/**
 * Renders every v1 Storybook story (430 of them) and records what the DOM looks like, plus errors,
 * console output and play-function results. Run it twice: once plain (v1), once with the story
 * imports redirected to v2 (see vitest.v1-stories.config.ts). `v1-v2-story-diff.mjs` then compares
 * the two recordings. A story that renders in v1 and throws, warns or loses behaviour in v2 is a
 * place where a consumer swapping v1 for v2 would break.
 */
import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { composeStories } from "@storybook/react";
import fs from "node:fs";
import path from "node:path";

const modules = import.meta.glob("../../src/components/ui/*.stories.tsx", { eager: true }) as Record<string, any>;
const OUT = process.env.REPLAY_OUT || "/tmp/story-replay.json";
const results: Record<string, any> = {};

const SKIP_ATTR = new Set(["class", "style", "id", "for", "aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-activedescendant", "aria-errormessage"]);

function norm(node: Node, ids: Map<string, number>): any {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = (node.textContent || "").replace(/\s+/g, " ").trim();
    return t || null;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const attrs: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) {
    if (SKIP_ATTR.has(a.name)) continue;
    if (a.name.startsWith("data-radix") || a.name === "data-aria-hidden") continue;
    attrs[a.name] = a.value.replace(/radix-[:«][^\s"]*[:»]|:r[0-9a-z]+:|«r[0-9a-z]+»|_r_[0-9a-z]+_/g, "#");
  }
  for (const k of ["for", "aria-labelledby", "aria-describedby", "aria-controls"]) {
    const v = el.getAttribute(k);
    if (v) attrs[k] = "→" + v.split(/\s+/).map((x) => (ids.has(x) ? "#" + ids.get(x) : "?")).join(",");
  }
  if (el.tagName === "STYLE") return ["style", {}];
  const kids = Array.from(el.childNodes).map((c) => norm(c, ids)).filter((x) => x !== null);
  return [el.tagName.toLowerCase(), attrs, ...kids];
}

function snapshot(root: HTMLElement) {
  const ids = new Map<string, number>();
  let n = 0;
  root.querySelectorAll("[id]").forEach((e) => ids.set(e.id, ++n));
  const tree = norm(root, ids);
  const idNames = [...ids.keys()].map((k) => k.replace(/^(radix-[^\s]*?|:r[0-9a-z]+:|«r[0-9a-z]+»|_r_[0-9a-z]+_)/, "<gen>"));
  const classes = new Set<string>();
  root.querySelectorAll("[class]").forEach((e) => (e.getAttribute("class") || "").split(/\s+/).filter(Boolean).forEach((c) => classes.add(c)));
  return { tree, ids: idNames, classes: [...classes] };
}

afterEach(() => cleanup());

describe("replay v1 stories", () => {
  for (const [file, mod] of Object.entries(modules)) {
    const comp = path.basename(file).replace(".stories.tsx", "");
    let stories: Record<string, any> = {};
    try {
      stories = composeStories(mod);
    } catch (e: any) {
      results[`${comp}::<compose>`] = { error: String(e?.message || e).slice(0, 300) };
      continue;
    }
    for (const [name, Story] of Object.entries(stories)) {
      it(`${comp} / ${name}`, async () => {
        const key = `${comp}::${name}`;
        const rec: any = { console: [] };
        const spies = (["error", "warn"] as const).map((lvl) =>
          vi.spyOn(console, lvl).mockImplementation((...a: any[]) => {
            rec.console.push(`${lvl}: ${String(a[0]).split("\n")[0].replace(/\s+/g, " ").slice(0, 200)}${a[1] && typeof a[1] === "string" ? " " + a[1] : ""}`);
          })
        );
        try {
          if (process.env.REPLAY_PROBE === "1") {
            // Pass-through probe: which element receives className / data-* / aria-label / ref?
            let refEl: any = null;
            const r = render(<Story {...({ "data-probe": "p", "aria-label": "probe-label", className: "probe-class", ref: (el: any) => { refEl = el; } } as any)} />);
            await new Promise((res) => setTimeout(res, 30));
            const desc = (el: Element | null) => (el ? `${el.tagName.toLowerCase()}${el.getAttribute("role") ? "[" + el.getAttribute("role") + "]" : ""}` : null);
            const q = (sel: string) => document.body.querySelector(sel);
            rec.probe = {
              data: desc(q("[data-probe]")),
              cls: desc(q(".probe-class")),
              label: desc(q('[aria-label="probe-label"]')),
              ref: refEl && refEl.tagName ? desc(refEl) : null,
              sameData: !!q("[data-probe]") && q("[data-probe]") === q(".probe-class"),
            };
            results[key] = rec;
            return;
          }
          const r = render(<Story />);
          await new Promise((res) => setTimeout(res, 30));
          try {
            if (typeof (Story as any).play === "function") await (Story as any).play({ canvasElement: r.container });
            rec.play = (Story as any).play ? "ok" : "none";
          } catch (e: any) {
            rec.play = "FAILED: " + String(e?.message || e).split("\n")[0].slice(0, 220);
          }
          await new Promise((res) => setTimeout(res, 30));
          rec.dom = snapshot(document.body);
        } catch (e: any) {
          rec.error = String(e?.message || e).split("\n")[0].slice(0, 300);
        } finally {
          spies.forEach((s) => s.mockRestore());
        }
        results[key] = rec;
        expect(true).toBe(true);
      }, 20000);
    }
  }
  it("write recording", () => {
    fs.writeFileSync(OUT, JSON.stringify(results));
  });
});

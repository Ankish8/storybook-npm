import { describe, expect, it } from "vitest";

/**
 * `motion-safe:animate-in` (tailwindcss-animate) resets the --tw-enter-* variables, and `animate-out` resets --tw-exit-*.
 * A plain `fade-in-0`, `zoom-in-95`, `slide-in-from-top-1` or `[--tw-enter-translate-y:4px]` in the same class string has
 * the same specificity but is emitted BEFORE the media-wrapped reset, so the reset wins and the animation runs with
 * identity keyframes: it exists (getAnimations() sees it) and moves nothing. Every such utility must carry the same
 * `motion-safe:` gate so it is emitted in the same block, after the reset.
 *
 * One exception is real, not a loophole: an attribute variant raises specificity. `data-[side=bottom]:slide-in-from-top-1`
 * (class + attribute) out-ranks a plain `motion-safe:animate-in` (class), so the reset cannot touch it. It only loses when
 * the matching reset carries at least as many attribute variants (`data-[state=open]:motion-safe:animate-in`, the dialog).
 */
const sources = import.meta.glob("../../v2/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const STRING =
  /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\$]|\\.|\$(?!\{))*`/g;
const NEEDS_GATE =
  /^(fade|zoom|slide)-(in|out)(-|$)|^\[--tw-(enter|exit)-[a-z-]+:[^\]]*\]$/;
const IS_EXIT = /^(fade|zoom|slide)-out|^\[--tw-exit-/;

const attributeVariants = (variants: string) =>
  (variants.match(/(?:^|:)(?:group-|peer-)?(?:data|aria)-/g) ?? []).length;

/** Split a class token at its last top-level `:` (colons inside [...] do not count). */
function utilityOf(token: string) {
  let depth = 0;
  let cut = -1;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === "[") depth++;
    else if (c === "]") depth--;
    else if (c === ":" && depth === 0) cut = i;
  }
  return { variants: token.slice(0, cut + 1), utility: token.slice(cut + 1) };
}

function offendersIn(source: string) {
  const offenders: string[] = [];
  for (const literal of source.match(STRING) ?? []) {
    const body = literal.slice(1, -1);
    if (!/motion-safe:animate-(in|out)/.test(body)) continue;
    const tokens = body.split(/\s+/);
    // animate-in resets only --tw-enter-*, animate-out only --tw-exit-*: compare each utility with ITS reset.
    const resetSpecificity = (direction: "in" | "out") =>
      Math.max(
        -1,
        ...tokens
          .map(utilityOf)
          .filter(({ utility }) => utility === `animate-${direction}`)
          .map(({ variants }) => attributeVariants(variants))
      );
    for (const token of tokens) {
      const { variants, utility } = utilityOf(token);
      if (!NEEDS_GATE.test(utility) || variants.includes("motion-safe:")) {
        continue;
      }
      const direction = IS_EXIT.test(utility) ? "out" : "in";
      if (attributeVariants(variants) <= resetSpecificity(direction)) {
        offenders.push(token);
      }
    }
  }
  return offenders;
}

describe("v2 enter/exit animation utilities are gated with motion-safe", () => {
  for (const [path, source] of Object.entries(sources)) {
    if (path.includes(".stories.")) continue;
    it(`${path.split("/").pop()} has no ungated fade/zoom/slide next to motion-safe:animate-in/out`, () => {
      expect(offendersIn(source)).toEqual([]);
    });
  }

  it("catches the dialog bug it was written for", () => {
    expect(
      offendersIn(
        `"data-[state=open]:motion-safe:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]"`
      )
    ).toEqual([
      "data-[state=open]:fade-in-0",
      "data-[state=open]:zoom-in-[0.98]",
    ]);
  });

  it("allows a higher-specificity attribute variant next to a plain reset", () => {
    expect(
      offendersIn(
        `"motion-safe:animate-in motion-safe:fade-in-0 data-[side=bottom]:slide-in-from-top-1"`
      )
    ).toEqual([]);
  });
});

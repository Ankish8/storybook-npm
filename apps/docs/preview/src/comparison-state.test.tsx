import "../../../../src/components/ui/__tests__/setup";
import { afterEach, expect, test } from "vitest";
import { applyComparisonState, isComparisonState } from "./comparison-state";
afterEach(() => document.body.replaceChildren());
test("review focus exposes the input and its shell without moving keyboard focus", () => {
  const frame = document.createElement("div");
  frame.innerHTML =
    '<div class="group"><button>Clear</button><input><div class="other"></div></div>';
  document.body.append(frame);
  const input = frame.querySelector("input")!;
  applyComparisonState(frame, "focus");
  expect(input).toHaveClass("pseudo-focus", "pseudo-focus-visible");
  expect(input.parentElement).toHaveClass("pseudo-focus-within");
  expect(document.activeElement).not.toBe(input);
  applyComparisonState(frame, "none");
  expect(input).not.toHaveClass("pseudo-focus");
  expect(input.parentElement).not.toHaveClass("pseudo-focus-within");
});
test("review cleanup preserves pseudo states supplied by the original story", () => {
  const frame = document.createElement("div");
  frame.innerHTML = '<input class="pseudo-focus">';
  applyComparisonState(frame, "focus");
  applyComparisonState(frame, "none");
  expect(frame.querySelector("input")).toHaveClass("pseudo-focus");
});
test("the same stagger values can be applied to the frozen and updated skeletons", () => {
  const frame = document.createElement("div");
  frame.innerHTML =
    '<div class="animate-pulse"></div><div class="animate-pulse"></div>';
  applyComparisonState(frame, "stagger");
  expect(
    (frame.children[1] as HTMLElement).style.getPropertyValue(
      "--v2-skeleton-delay"
    )
  ).toBe("160ms");
  applyComparisonState(frame, "none");
  expect(
    (frame.children[1] as HTMLElement).style.getPropertyValue(
      "--v2-skeleton-delay"
    )
  ).toBe("");
  expect(isComparisonState("arbitrary-command")).toBe(false);
});

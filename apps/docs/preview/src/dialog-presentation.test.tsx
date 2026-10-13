import { expect, test } from "vitest";
import { createDialogPresentation } from "./dialog-presentation";

test("initially-open static samples stay inline, including interaction inside the same dialog", () => {
  const tracker = createDialogPresentation(() => 1000);
  const dialog = document.createElement("div");
  expect(tracker.update([dialog])).toEqual({
    dialogOpen: true,
    fullscreen: false,
  });
  tracker.activate();
  expect(tracker.update([dialog]).fullscreen).toBe(false);
  tracker.requestFullscreen();
  expect(tracker.update([dialog]).fullscreen).toBe(true);
  expect(tracker.update([])).toEqual({ dialogOpen: false, fullscreen: false });
});
test("a newly-entered dialog follows a user activation; stale activation does not expand another demo", () => {
  let clock = 0;
  const tracker = createDialogPresentation(() => clock);
  const parent = document.createElement("div");
  const child = document.createElement("div");
  tracker.update([]);
  tracker.activate();
  expect(tracker.update([parent]).fullscreen).toBe(true);
  tracker.update([]);
  clock = 6000;
  expect(tracker.update([child]).fullscreen).toBe(false);
});

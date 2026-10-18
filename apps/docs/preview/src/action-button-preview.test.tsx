import * as React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import * as stories from "../../../../src/components/ui/v2/action-button.stories";
import { controlArgTypes, mapArgs, prepareStory } from "./model.mjs";
import { PreviewContext, type Args } from "./preview-api";
import { createStoryRenderer } from "./story-renderer";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function preview(id: string, initial: Args = {}) {
  const prepared = prepareStory(stories, id, "action-button");
  const Story = createStoryRenderer(prepared);
  let setControls: (patch: Args) => void;
  let current: Args;
  function Harness() {
    const [args, setArgs] = React.useState<Args>({
      ...prepared.initialArgs,
      ...initial,
    });
    const update = React.useCallback(
      (patch: Args) => setArgs((old) => ({ ...old, ...patch })),
      []
    );
    React.useLayoutEffect(() => {
      current = args;
      setControls = update;
    }, [args, update]);
    return (
      <PreviewContext.Provider
        value={{
          args,
          updateArgs: update,
          resetArgs: () => setArgs(prepared.initialArgs),
          context: {
            args: mapArgs(args, prepared.argTypes),
            parameters: prepared.parameters,
          },
        }}
      >
        <Story />
      </PreviewContext.Provider>
    );
  }
  const view = render(<Harness />);
  return {
    ...view,
    prepared,
    args: () => current,
    update: (patch: Args) => act(() => setControls(patch)),
  };
}

test("ActionButton Customize labels, size and palette stay live through a real async task", async () => {
  vi.useFakeTimers();
  const view = preview("Overview", { delayMs: 500, resetAfterMs: 0 });
  view.update({
    label: "Publish",
    pendingLabel: "Publishing",
    successLabel: "Published",
    size: "lg",
    variant: "secondary",
  });
  const button = screen.getByRole("button", { name: "Publish" });
  expect(button.classList.contains("h-11")).toBe(true);
  expect(button.classList.contains("bg-v2-semantic-bg-ui")).toBe(true);
  button.focus();
  await act(async () => {
    fireEvent.click(button);
  });
  expect(button.getAttribute("data-state")).toBe("pending");
  expect(screen.getByRole("status").textContent).toBe("Publishing");
  expect(document.activeElement).toBe(button);
  view.update({ successLabel: "Done", size: "sm" });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  expect(button.getAttribute("data-state")).toBe("success");
  expect(screen.getByRole("status").textContent).toBe("Done");
  expect(button.classList.contains("h-8")).toBe(true);
  view.update({ disabled: true });
  expect((button as HTMLButtonElement).disabled).toBe(true);
});

test("failure example shows a visible error then succeeds on retry", async () => {
  vi.useFakeTimers();
  preview("FailureAndRetry", { delayMs: 100, resetAfterMs: 0 });
  const button = screen.getByRole("button", { name: "Save changes" });
  await act(async () => {
    fireEvent.click(button);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(button.getAttribute("data-state")).toBe("idle");
  expect(screen.getByRole("alert").textContent).toContain("Please try again");
  await act(async () => {
    fireEvent.click(button);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(screen.queryByRole("alert")).toBeNull();
  expect(button.getAttribute("data-state")).toBe("success");
});

test("comparison examples expose only relevant Controls and fixed states", async () => {
  vi.useFakeTimers();
  const gallery = preview("AllVariants");
  expect(screen.getAllByRole("button")).toHaveLength(5);
  expect(controlArgTypes(gallery.prepared, gallery.args())).not.toHaveProperty(
    "variant"
  );
  gallery.unmount();
  const sizes = preview("AllSizes");
  expect(screen.getAllByRole("button")).toHaveLength(3);
  sizes.unmount();
  preview("States");
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1);
  });
  expect(
    screen
      .getAllByRole("button")
      .map((button) => button.getAttribute("data-state"))
  ).toEqual(["idle", "pending", "success", "idle"]);
  expect((screen.getAllByRole("button")[3] as HTMLButtonElement).disabled).toBe(
    true
  );
});

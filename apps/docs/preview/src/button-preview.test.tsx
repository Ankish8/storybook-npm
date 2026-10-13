import * as React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import * as stories from "../../../../src/components/ui/v2/button.stories";
import { controlArgTypes, mapArgs, prepareStory } from "./model.mjs";
import { PreviewContext, type Args } from "./preview-api";
import { createStoryRenderer } from "./story-renderer";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function preview(id: string, initial: Args = {}) {
  const prepared = prepareStory(stories, id, "button");
  const Story = createStoryRenderer(prepared);
  let setControls: (patch: Args) => void = () => {
    throw new Error("Preview controls are not committed.");
  };
  let current: Args = {};
  function Harness() {
    const [args, setArgs] = React.useState<Args>({
      ...prepared.initialArgs,
      ...initial,
    });
    const updateArgs = React.useCallback(
      (patch: Args) => setArgs((old) => ({ ...old, ...patch })),
      []
    );
    React.useLayoutEffect(() => {
      current = args;
      setControls = updateArgs;
    }, [args, updateArgs]);
    return (
      <PreviewContext.Provider
        value={{
          args,
          updateArgs,
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

test("icon-only Controls offer square sizes and keep the icon mounted through loading", () => {
  const view = preview("IconOnly");
  const controls = controlArgTypes(view.prepared, view.args()) as Record<
    string,
    { options?: string[] }
  >;
  expect(view.prepared.parameters.layout).toBe("centered");
  expect(controls.size.options).toEqual(["icon-sm", "icon", "icon-lg"]);
  const button = screen.getByRole("button", { name: "Add item" });
  for (const [size, width] of [
    ["icon-sm", "w-9"],
    ["icon", "w-11"],
    ["icon-lg", "w-[50px]"],
  ]) {
    view.update({ size });
    expect(button.classList.contains(width)).toBe(true);
    expect(button.classList.contains("p-0")).toBe(true);
    expect(button.querySelector("svg.lucide-plus")).not.toBeNull();
  }
  view.update({ loading: true });
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect((button as HTMLButtonElement).disabled).toBe(true);
  expect(
    button.querySelector("[data-v2-button-spinner][data-loading=true]")
  ).not.toBeNull();
  expect(
    button
      .querySelector("[data-v2-button-content]")
      ?.getAttribute("data-concealed")
  ).toBe("true");
  view.update({ loading: false });
  expect(button.querySelector("svg.lucide-plus")).not.toBeNull();
  expect(button.hasAttribute("aria-busy")).toBe(false);
  expect((button as HTMLButtonElement).disabled).toBe(false);
});

test("canonical gallery shows five styles while v1 comparison retains all nine names", () => {
  const view = preview("AllVariants");
  expect(screen.getAllByRole("button")).toHaveLength(5);
  expect(view.prepared.parameters.layout).toBe("centered");
  view.unmount();
  const comparison = preview("V1VsV2");
  expect(screen.getAllByRole("button")).toHaveLength(9 * 3 * 2);
  expect(comparison.container.textContent).toContain("default");
  expect(comparison.container.textContent).toContain("outline");
});

test("save feedback and loading stay synchronized with Customize args", () => {
  vi.useFakeTimers();
  const view = preview("SaveFlow");
  const button = screen.getByRole("button", { name: "Save changes" });
  button.focus();
  expect(document.activeElement).toBe(button);
  fireEvent.click(button);
  expect(view.args().loading).toBe(true);
  expect((button as HTMLButtonElement).disabled).toBe(true);
  expect(
    button.querySelector("[data-v2-button-spinner][data-loading=true]")
  ).not.toBeNull();
  expect(screen.getByRole("status").textContent).toContain("Saving");
  act(() => vi.advanceTimersByTime(1100));
  expect(view.args().loading).toBe(false);
  expect((button as HTMLButtonElement).disabled).toBe(false);
  expect(view.args().children).toBe("Saved");
  expect(screen.getByRole("status").textContent).toContain("Draft saved");
  view.update({ loading: true, children: "Retry" });
  expect(button.getAttribute("aria-busy")).toBe("true");
  view.update({ loading: false });
  expect(button.textContent).toContain("Retry");
});

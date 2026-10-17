import "../../../../src/components/ui/__tests__/setup";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import * as stories from "../../../../src/components/ui/v2/split-button.stories";
import { controlArgTypes, mapArgs, prepareStory } from "./model.mjs";
import { PreviewContext, type Args } from "./preview-api";
import { createStoryRenderer } from "./story-renderer";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function preview(id: string, initial: Args = {}) {
  const prepared = prepareStory(stories, id, "split-button");
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

test("SplitButton menu visibility stays synchronized with Customize", async () => {
  const view = preview("Overview");
  const trigger = screen.getByRole("button", { name: "Publish more actions" });
  trigger.focus();
  await userEvent.keyboard("{Enter}");
  expect(view.args().open).toBe(true);
  expect(screen.getByRole("menu")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(view.args().open).toBe(false);
  expect(trigger).toHaveFocus();
  view.update({ open: true });
  expect(screen.getByRole("menu")).toBeInTheDocument();
  view.update({ loading: true });
  expect(screen.queryByRole("menu")).toBeNull();
  expect(view.args().open).toBe(false);
});

test("SplitButton label, sizes, icons and menu-item Controls change the real preview", async () => {
  const view = preview("Overview");
  view.update({
    label: "Send reply",
    size: "sm",
    showIcons: false,
    draftLabel: "Keep draft",
    disableDraft: true,
  });
  const main = screen.getByRole("button", { name: "Send reply" });
  expect(main).toHaveClass("h-[30px]");
  expect(main.querySelector("svg")).toBeNull();
  screen.getByRole("button", { name: "Send reply more actions" }).focus();
  await userEvent.keyboard("{Enter}");
  expect(screen.getByRole("menuitem", { name: "Keep draft" })).toHaveAttribute(
    "data-disabled"
  );
  view.update({ disableDraft: false });
  await userEvent.click(screen.getByRole("menuitem", { name: "Keep draft" }));
  expect(
    screen.getByRole("button", { name: "Draft saved" })
  ).toBeInTheDocument();
  expect(view.args().open).toBe(false);
});

test("SplitButton comparisons hide fixed axes and keep independent menus", async () => {
  const view = preview("AllVariants");
  expect(screen.getAllByRole("group")).toHaveLength(2);
  expect(controlArgTypes(view.prepared, view.args())).not.toHaveProperty(
    "variant"
  );
  expect(controlArgTypes(view.prepared, view.args())).not.toHaveProperty(
    "open"
  );
  screen.getAllByRole("button", { name: "Publish more actions" })[0].focus();
  await userEvent.keyboard("{Enter}");
  expect(screen.getAllByRole("menu")).toHaveLength(1);
  await userEvent.keyboard("{Escape}");
  view.unmount();
  preview("AllSizes");
  expect(screen.getAllByRole("group")).toHaveLength(3);
});

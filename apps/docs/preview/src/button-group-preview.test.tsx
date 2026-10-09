import "../../../../src/components/ui/__tests__/setup";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import * as stories from "../../../../src/components/ui/v2/button-group.stories";
import { controlArgTypes, mapArgs, prepareStory } from "./model.mjs";
import { PreviewContext, type Args } from "./preview-api";
import { createStoryRenderer } from "./story-renderer";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function preview(id: string, initial: Args = {}) {
  const prepared = prepareStory(stories, id, "button-group");
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

test("ButtonGroup Customize changes labels, presentation and disabled states in the actual example", async () => {
  const view = preview("Overview");
  view.update({
    firstLabel: "Copy link",
    variant: "solid",
    size: "sm",
    orientation: "vertical",
    showIcons: false,
    showMenu: false,
  });
  const group = screen.getByRole("group", { name: "Document actions" });
  expect(group).toHaveClass("bg-semantic-primary");
  expect(group).toHaveAttribute("data-orientation", "vertical");
  const action = screen.getByRole("button", { name: "Copy link" });
  expect(action).toHaveClass("h-[34px]");
  expect(action.querySelector("svg")).toBeNull();
  expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  await userEvent.click(action);
  expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  view.update({ firstLabel: "Share again", disabled: true });
  expect(screen.getByRole("button", { name: "Share again" })).toBeDisabled();
});
test("ButtonGroup action and menu feedback are live and confined to the demo", async () => {
  preview("Overview");
  act(() => screen.getByRole("button", { name: "More actions" }).focus());
  await userEvent.keyboard("{Enter}{Enter}");
  expect(
    screen.getByText("Pinned to the sidebar in this demo")
  ).toBeInTheDocument();
  expect(screen.queryByRole("menu")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Duplicate" }));
  expect(
    screen.getByText("A duplicate was created in this demo")
  ).toBeInTheDocument();
});
test("ButtonGroup compatibility selection stays synchronized with Controls", async () => {
  const view = preview("SelectionCompatibility");
  await userEvent.click(screen.getByRole("button", { name: "List" }));
  expect(view.args().value).toBe("list");
  view.update({ value: "calendar" });
  expect(screen.getByRole("button", { name: "Calendar" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  expect(screen.getByText("Showing the calendar view")).toBeInTheDocument();
});
test("ButtonGroup comparison examples are independent and exclude the demonstrated control", async () => {
  const view = preview("AllVariants");
  expect(controlArgTypes(view.prepared, view.args())).not.toHaveProperty(
    "variant"
  );
  const actions = screen.getAllByRole("button", { name: "Share" });
  expect(actions).toHaveLength(2);
  await userEvent.click(actions[0]);
  expect(screen.getAllByRole("button", { name: "Copied" })).toHaveLength(1);
  expect(screen.getAllByRole("button", { name: "Share" })).toHaveLength(1);
});
test("ButtonGroup zoom controls update their value and reset", async () => {
  preview("ZoomControls");
  await userEvent.click(screen.getByRole("button", { name: "Zoom in" }));
  const reset = screen.getByRole("button", {
    name: "Zoom 110%, reset to 100%",
  });
  expect(reset).toBeInTheDocument();
  await userEvent.click(reset);
  expect(
    screen.getByRole("button", { name: "Zoom 100%, reset to 100%" })
  ).toBeInTheDocument();
});

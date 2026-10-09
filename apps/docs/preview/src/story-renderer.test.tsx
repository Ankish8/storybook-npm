import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { cleanup } from "@testing-library/react";
import { PreviewContext, useArgs } from "./preview-api";
import { createStoryRenderer } from "./story-renderer";

afterEach(cleanup);
test("typing and parent Controls stay synchronized without remounting the focused input", () => {
  let mounts = 0;
  const prepared = {
    decorators: [
      (Story: React.ComponentType, context: any) => (
        <div data-testid="decorator" data-variant={context.args.variant}>
          <Story />
        </div>
      ),
    ],
    meta: {},
    story: {
      render(args: any) {
        const [, update] = useArgs();
        React.useEffect(() => {
          mounts++;
        }, []);
        return (
          <input
            aria-label="Example"
            value={args.value}
            onChange={(event) => update({ value: event.target.value })}
          />
        );
      },
    },
  };
  const Story = createStoryRenderer(prepared);
  function Harness() {
    const [args, setArgs] = React.useState({ value: "", variant: "default" });
    return (
      <PreviewContext.Provider
        value={{
          args,
          context: { args },
          updateArgs: (patch) =>
            setArgs((previous) => ({ ...previous, ...patch })),
          resetArgs: () => setArgs({ value: "", variant: "default" }),
        }}
      >
        <button
          onClick={() => setArgs({ value: "From Controls", variant: "error" })}
        >
          Change Controls
        </button>
        <output>{args.value}</output>
        <Story />
      </PreviewContext.Provider>
    );
  }
  render(<Harness />);
  const input = screen.getByRole("textbox") as HTMLInputElement;
  input.focus();
  fireEvent.change(input, { target: { value: "Typed" } });
  expect(input.value).toBe("Typed");
  expect(screen.getByText("Typed").tagName).toBe("OUTPUT");
  expect(document.activeElement).toBe(input);
  expect(mounts).toBe(1);
  fireEvent.click(screen.getByRole("button", { name: "Change Controls" }));
  expect(input.value).toBe("From Controls");
  expect(screen.getByTestId("decorator").getAttribute("data-variant")).toBe(
    "error"
  );
  expect(mounts).toBe(1);
});

import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { cleanup } from "@testing-library/react";
import {
  PreviewContext,
  useArgs,
  type Args,
  type StoryDecorator,
} from "./preview-api";
import { createStoryRenderer } from "./story-renderer";
import { clearAllMocks, fn, setActionSink } from "./storybook-test";

afterEach(cleanup);
test("typing and parent Controls stay synchronized without remounting the focused input", () => {
  let mounts = 0;
  const decorate: StoryDecorator = (Story, context) => (
    <div
      data-testid="decorator"
      data-variant={String(context.args.variant ?? "")}
    >
      <Story />
    </div>
  );
  function ControlledInput(args: Args) {
    const [, update] = useArgs();
    React.useEffect(() => {
      mounts++;
    }, []);
    return (
      <input
        aria-label="Example"
        value={typeof args.value === "string" ? args.value : ""}
        onChange={(event) => update({ value: event.target.value })}
      />
    );
  }
  const prepared = {
    decorators: [decorate],
    meta: {},
    story: {
      render: ControlledInput,
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

test("render callback mocks keep typed implementations, this, once values and action records", async () => {
  const actions: { name: string; args: unknown[] }[] = [];
  const receiver = { prefix: "Contact" };
  const callback = fn(function (this: typeof receiver, value: string) {
    return `${this.prefix}: ${value}`;
  }).mockName("contact update");
  setActionSink((name, args) => actions.push({ name, args }));
  try {
    // Implementation signatures remain specific, including after fn() without an implementation.
    const initiallyEmpty = fn().mockImplementation(
      (value: string) => value.length
    );
    expect(initiallyEmpty("Mira")).toBe(4);
    callback.mockImplementationOnce((value: string) => value.length);
    expect(callback.call(receiver, "Mira")).toBe(4);
    expect(callback.call(receiver, "Owen")).toBe("Contact: Owen");
    expect(callback.mock.calls).toEqual([["Mira"], ["Owen"]]);
    expect(callback.mock.instances).toEqual([receiver, receiver]);
    expect(actions.at(-1)).toEqual({ name: "contact update", args: ["Owen"] });
    const typed = fn((value: string) => value.length).mockImplementation(
      (value) => value.length + 1
    );
    expect(typed("Mira")).toBe(5);
    callback.mockResolvedValueOnce({ saved: true });
    await expect(callback.call(receiver, "Leena")).resolves.toEqual({
      saved: true,
    });
    callback.mockReturnValueOnce(42);
    expect(callback.call(receiver, "Atlas")).toBe(42);
    clearAllMocks();
    expect(callback.mock.calls).toEqual([]);
    expect(callback.call(receiver, "Mira")).toBe("Contact: Mira");
    callback.mockReset();
    expect(callback.call(receiver, "Mira")).toBeUndefined();
  } finally {
    setActionSink(undefined);
    clearAllMocks();
  }
});

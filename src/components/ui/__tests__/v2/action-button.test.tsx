import * as React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActionButton } from "../../v2/action-button";
import { Button } from "../../v2/button";
import { Button as ButtonV1 } from "../../button";

function deferred() {
  let resolve!: (value?: unknown) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ActionButton", () => {
  it("starts as a native action with a stable name, arrow, and no implicit form submit", async () => {
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <ActionButton label="Publish" onAction={vi.fn()} />
      </form>
    );
    const button = screen.getByRole("button", { name: "Publish" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-state", "idle");
    expect(
      button.querySelector('[data-action-icon="idle"] svg')
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(submit).not.toHaveBeenCalled();
  });

  it("awaits the actual promise, prevents same-tick repeats and retains focus", async () => {
    const task = deferred();
    const run = vi.fn(() => task.promise);
    render(<ActionButton label="Save" onAction={run} />);
    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    act(() => {
      button.click();
      button.click();
      button.click();
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("data-state", "pending");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    expect(button).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Saving");
    expect(button.querySelector("[data-action-spinner]")).toHaveClass(
      "animate-spin"
    );
    await act(async () => task.resolve());
    expect(button).toHaveAttribute("data-state", "success");
    expect(button).toHaveAccessibleName("Save");
    expect(button).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(button).not.toHaveAttribute("aria-busy");
  });

  it.each(["{Enter}", " "])(
    "supports native keyboard activation with %s",
    async (key) => {
      const run = vi.fn();
      render(<ActionButton label="Run" onAction={run} />);
      screen.getByRole("button").focus();
      await userEvent.keyboard(key);
      expect(run).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(screen.getByRole("button")).toHaveAttribute(
          "data-state",
          "success"
        )
      );
    }
  );

  it("does not block Tab while pending", async () => {
    render(
      <>
        <ActionButton label="Save" onAction={() => new Promise(() => {})} />
        <button>Next</button>
      </>
    );
    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    fireEvent.click(button);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
  });

  it.each([
    { disabled: true },
    { "aria-disabled": true as const },
    { "aria-disabled": "true" as const },
  ])("honors explicit disabled attributes: %j", async (disabled) => {
    const run = vi.fn();
    const capture = vi.fn();
    render(
      <ActionButton
        label="Save"
        onAction={run}
        onClickCapture={capture}
        {...disabled}
      />
    );
    await userEvent.click(screen.getByRole("button"));
    expect(run).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
  });

  it("honors capture cancellation", async () => {
    const run = vi.fn();
    render(
      <ActionButton
        label="Save"
        onAction={run}
        onClickCapture={(event) => event.preventDefault()}
      />
    );
    await userEvent.click(screen.getByRole("button"));
    expect(run).not.toHaveBeenCalled();
  });

  it("announces a rejection, forwards the original error and allows retry", async () => {
    const error = new Error("Offline");
    const run = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(undefined);
    const onError = vi.fn();
    render(
      <ActionButton
        label="Save"
        onAction={run}
        onActionError={onError}
        errorLabel="Could not save. Try again."
      />
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(button).toHaveAttribute("data-state", "idle");
    expect(onError).toHaveBeenCalledWith(error);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Could not save. Try again."
    );
    await userEvent.click(button);
    expect(button).toHaveAttribute("data-state", "success");
    expect(run).toHaveBeenCalledTimes(2);
  });

  it("catches synchronous action errors too", async () => {
    const error = new Error("Validation failed");
    const onError = vi.fn();
    render(
      <ActionButton
        label="Save"
        onAction={() => {
          throw error;
        }}
        onActionError={onError}
      />
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onError).toHaveBeenCalledWith(error);
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "idle");
  });

  it("resets after the requested delay, or keeps success when reset is zero", async () => {
    vi.useFakeTimers();
    const changes = vi.fn();
    const view = render(
      <ActionButton
        label="Save"
        onAction={() => {}}
        resetAfterMs={500}
        onStateChange={changes}
      />
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "success");
    act(() => vi.advanceTimersByTime(499));
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "success");
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "idle");
    expect(changes.mock.calls.map((call) => call[0])).toEqual([
      "pending",
      "success",
      "idle",
    ]);
    view.rerender(
      <ActionButton label="Save" onAction={() => {}} resetAfterMs={0} />
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "success");
  });

  it("cancels a reset timer when its delay changes or the component unmounts", async () => {
    vi.useFakeTimers();
    const changes = vi.fn();
    const view = render(
      <ActionButton
        label="Save"
        onAction={() => {}}
        resetAfterMs={200}
        onStateChange={changes}
      />
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    view.rerender(
      <ActionButton
        label="Save"
        onAction={() => {}}
        resetAfterMs={0}
        onStateChange={changes}
      />
    );
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "success");
    view.rerender(
      <ActionButton
        label="Save"
        onAction={() => {}}
        resetAfterMs={200}
        onStateChange={changes}
      />
    );
    view.unmount();
    act(() => vi.advanceTimersByTime(300));
    expect(changes.mock.calls.map((call) => call[0])).toEqual([
      "pending",
      "success",
    ]);
  });

  it.each(["resolve", "reject"] as const)(
    "ignores late %s after unmount",
    async (result) => {
      const task = deferred();
      const changes = vi.fn();
      const onError = vi.fn();
      const view = render(
        <ActionButton
          label="Save"
          onAction={() => task.promise}
          onStateChange={changes}
          onActionError={onError}
        />
      );
      fireEvent.click(screen.getByRole("button"));
      view.unmount();
      await act(async () => {
        if (result === "resolve") task.resolve();
        else task.reject(new Error("Late"));
      });
      expect(changes).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
    }
  );

  it("keeps changed labels live during a pending task", async () => {
    const task = deferred();
    const view = render(
      <ActionButton
        label="Save"
        pendingLabel="Saving"
        onAction={() => task.promise}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    view.rerender(
      <ActionButton
        label="Publish"
        pendingLabel="Publishing"
        successLabel="Published"
        onAction={() => task.promise}
      />
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Publish");
    expect(screen.getByRole("status")).toHaveTextContent("Publishing");
    await act(async () => task.resolve());
    expect(screen.getByRole("status")).toHaveTextContent("Published");
  });

  it("keeps shared letters mounted across Save / Saving / Saved", async () => {
    const task = deferred();
    render(<ActionButton label="Save" onAction={() => task.promise} />);
    const button = screen.getByRole("button");
    const prefix = Array.from(
      button.querySelectorAll("[data-action-glyph]")
    ).slice(0, 3);
    fireEvent.click(button);
    expect(
      Array.from(button.querySelectorAll("[data-action-glyph]")).slice(0, 3)
    ).toEqual(prefix);
    await act(async () => task.resolve());
    expect(
      Array.from(button.querySelectorAll("[data-action-glyph]")).slice(0, 3)
    ).toEqual(prefix);
  });

  it.each([
    "default",
    "primary",
    "secondary",
    "outline",
    "ghost",
    "link",
    "destructive",
    "success",
    "dashed",
  ] as const)("uses the shared Button palette for %s", (variant) => {
    render(
      <>
        <ActionButton label="Run" onAction={() => {}} variant={variant} />
        <Button variant={variant}>Base</Button>
      </>
    );
    const button = screen.getByRole("button", { name: "Run" });
    const base = screen.getByRole("button", { name: "Base" });
    // Arc retunes padding, icon size and opacity feedback; the palette (every
    // background, border and text class, hover and active included) stays shared.
    const palette = [...base.classList].filter((name) =>
      /(^|:)(bg|border|text)-/.test(name)
    );
    expect(palette.length).toBeGreaterThan(0);
    for (const name of palette) expect(button).toHaveClass(name);
    expect(button).toHaveClass("overflow-hidden");
  });

  it.each([
    ["sm", "h-8"],
    ["default", "h-10"],
    ["lg", "h-11"],
  ] as const)("matches Button's %s size and radius", (size, height) => {
    render(<ActionButton label="Run" onAction={() => {}} size={size} />);
    expect(screen.getByRole("button")).toHaveClass(
      height,
      "rounded-lg",
      "font-medium"
    );
  });

  it("forwards a ref and native attributes while allowing style overrides", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <ActionButton
        ref={ref}
        label="Run"
        onAction={() => {}}
        id="task"
        title="Run task"
        aria-label="Start import"
        className="h-14 w-full"
      />
    );
    const button = screen.getByRole("button", { name: "Start import" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("id", "task");
    expect(button).toHaveClass("h-14", "w-full");
    expect(button).not.toHaveClass("h-10");
  });

  it("coexists with both existing Button generations", () => {
    render(
      <>
        <ButtonV1>Legacy</ButtonV1>
        <Button>Current</Button>
        <ActionButton label="Async" onAction={() => {}} />
      </>
    );
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Legacy" })).toHaveClass(
      "h-9",
      "rounded"
    );
    expect(screen.getByRole("button", { name: "Current" })).toHaveClass(
      "h-10",
      "rounded-lg"
    );
    expect(screen.getByRole("button", { name: "Async" })).toHaveClass(
      "h-10",
      "rounded-lg"
    );
  });
});

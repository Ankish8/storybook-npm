import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { Stepper } from "../../v2/stepper";
import BasicExample from "../../../../../apps/docs/examples/stepper/basic";
const steps = [{ title: "Details" }, { title: "Review" }];
it("exposes the current step in an ordered list", () => {
  render(<Stepper steps={steps} currentStep={1} />);
  expect(screen.getByRole("list")).toHaveAccessibleName("Progress steps");
  expect(screen.getAllByRole("listitem")[1]).toHaveAttribute(
    "aria-current",
    "step"
  );
});
it("allows native step activation", () => {
  const change = vi.fn();
  render(<Stepper steps={steps} onStepChange={change} />);
  fireEvent.click(screen.getByRole("button", { name: "Review" }));
  expect(change).toHaveBeenCalledWith(1);
});
it("prevents unavailable steps being activated", () => {
  const change = vi.fn();
  render(
    <Stepper
      steps={[steps[0], { title: "Review", disabled: true }]}
      onStepChange={change}
    />
  );
  fireEvent.click(screen.getByRole("button", { name: "Review" }));
  expect(change).not.toHaveBeenCalled();
});
it("renders read-only progress without interactive buttons", () => {
  render(<Stepper steps={steps} />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("preserves all-step navigation by default and opt-in completed-only restrictions", () => {
  const change = vi.fn();
  const { rerender } = render(
    <Stepper steps={steps} currentStep={0} onStepChange={change} />
  );
  fireEvent.click(screen.getByRole("button", { name: "Review" }));
  expect(change).toHaveBeenLastCalledWith(1);
  change.mockClear();
  rerender(
    <Stepper
      steps={steps}
      currentStep={1}
      onStepChange={change}
      navigation="completed"
    />
  );
  expect(screen.getByRole("button", { name: "Review" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Review" }));
  expect(change).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Details" }));
  expect(change).toHaveBeenCalledTimes(1);
  expect(change).toHaveBeenCalledWith(0);
});

it("does not change progress when arrow navigation skips a disabled step", () => {
  const change = vi.fn();
  render(
    <Stepper
      steps={[steps[0], { title: "Unavailable", disabled: true }, steps[1]]}
      onStepChange={change}
    />
  );
  const first = screen.getByRole("button", { name: "Details" });
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowRight" });
  expect(screen.getByRole("button", { name: "Review" })).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, { key: "Home" });
  expect(first).toHaveFocus();
  fireEvent.keyDown(first, { key: "End" });
  expect(screen.getByRole("button", { name: "Review" })).toHaveFocus();
  expect(change).not.toHaveBeenCalled();
});

it("uses vertical and right-to-left keyboard directions", () => {
  const { rerender } = render(
    <Stepper steps={steps} onStepChange={vi.fn()} orientation="vertical" />
  );
  const first = screen.getByRole("button", { name: "Details" });
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowDown" });
  expect(screen.getByRole("button", { name: "Review" })).toHaveFocus();
  rerender(
    <Stepper
      steps={steps}
      onStepChange={vi.fn()}
      dir="rtl"
      style={{ direction: "rtl" }}
    />
  );
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowLeft" });
  expect(screen.getByRole("button", { name: "Review" })).toHaveFocus();
});

it("honors a caller's prevented keyboard event", () => {
  render(
    <Stepper
      steps={steps}
      onStepChange={vi.fn()}
      onKeyDown={(event) => event.preventDefault()}
    />
  );
  const first = screen.getByRole("button", { name: "Details" });
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowRight" });
  expect(first).toHaveFocus();
});

it("draws checks with a normalized path and resets them when returning", () => {
  const { container, rerender } = render(
    <Stepper steps={steps} currentStep={0} />
  );
  const path = container.querySelector("path")!;
  expect(path).toHaveAttribute("pathLength", "1");
  expect(path).toHaveAttribute("stroke-dasharray", "1");
  expect(path).toHaveAttribute("stroke-dashoffset", "1");
  rerender(<Stepper steps={steps} currentStep={1} />);
  expect(path).toHaveAttribute("stroke-dashoffset", "0");
  rerender(<Stepper steps={steps} currentStep={0} />);
  expect(path).toHaveAttribute("stroke-dashoffset", "1");
});

it("supports the all-complete state and keeps custom icons", () => {
  const { container } = render(
    <Stepper
      steps={[
        { title: "Details", icon: <svg data-testid="custom-icon" /> },
        steps[1],
      ]}
      currentStep={2}
      marker="icon"
    />
  );
  expect(container.querySelectorAll('[data-state="complete"]')).toHaveLength(2);
  expect(container.querySelector('[aria-current="step"]')).toBeNull();
  expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  expect(container.querySelectorAll('path[pathLength="1"]')).toHaveLength(1);
});

it("never submits a form or fires callbacks on controlled updates", () => {
  const submit = vi.fn((event) => event.preventDefault());
  const change = vi.fn();
  const { rerender } = render(
    <form onSubmit={submit}>
      <Stepper steps={steps} onStepChange={change} />
    </form>
  );
  fireEvent.click(screen.getByRole("button", { name: "Review" }));
  expect(submit).not.toHaveBeenCalled();
  change.mockClear();
  rerender(
    <form onSubmit={submit}>
      <Stepper steps={steps} currentStep={2} onStepChange={change} disabled />
    </form>
  );
  fireEvent.click(screen.getByRole("button", { name: "Details" }));
  expect(change).not.toHaveBeenCalled();
});

it("forwards the ordered list ref, custom styles and aria label", () => {
  const ref = { current: null as HTMLOListElement | null };
  render(
    <Stepper
      steps={steps}
      ref={ref}
      className="consumer-class"
      style={{ width: 320 }}
      aria-label="Setup steps"
      size="sm"
    />
  );
  expect(ref.current).toBe(screen.getByRole("list", { name: "Setup steps" }));
  expect(ref.current).toHaveClass("consumer-class");
  expect(ref.current).toHaveStyle({ width: "320px" });
});

it("the live flow advances, revisits, finishes and restarts", () => {
  render(<BasicExample />);
  expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3: Details");
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 3: Team");
  fireEvent.click(
    screen.getByRole("button", { name: "Details Name your workspace" })
  );
  expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3: Details");
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.click(screen.getByRole("button", { name: "Finish" }));
  expect(screen.getByRole("status")).toHaveTextContent("All steps complete");
  expect(
    screen
      .getAllByRole("listitem")
      .every((item) => item.dataset.state === "complete")
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Restart" }));
  expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3: Details");
});

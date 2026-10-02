import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { Stepper } from "../../v2/stepper";
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

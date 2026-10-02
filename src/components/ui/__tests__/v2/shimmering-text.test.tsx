import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { ShimmeringText } from "../../v2/shimmering-text";
it("announces a meaningful loading status", () => {
  render(<ShimmeringText>Importing</ShimmeringText>);
  expect(screen.getByRole("status")).toHaveTextContent("Importing");
  expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
});
it("allows pausing the decorative effect without hiding text", () => {
  const { container } = render(
    <ShimmeringText active={false}>Loading</ShimmeringText>
  );
  expect(screen.getByRole("status")).toHaveTextContent("Loading");
  expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
});

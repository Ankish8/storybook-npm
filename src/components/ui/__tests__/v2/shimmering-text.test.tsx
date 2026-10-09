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
it("keeps the live region reading only the current label when the text changes", () => {
  const { rerender } = render(<ShimmeringText>Importing</ShimmeringText>);
  rerender(<ShimmeringText>Syncing</ShimmeringText>);
  expect(screen.getByText("Syncing")).not.toHaveAttribute("aria-hidden");
  const old = screen.queryByText("Importing");
  if (old) expect(old).toHaveAttribute("aria-hidden", "true");
});
it("paints the sweep as a text-clipped gradient on the label, with no injected stylesheet", () => {
  const { container } = render(<ShimmeringText>Importing</ShimmeringText>);
  expect(container.querySelector("style")).toBeNull();
  expect(screen.getByText("Importing")).toHaveClass(
    "[-webkit-text-fill-color:transparent]",
    "[background-clip:text]"
  );
});
it("accepts non-text children and keeps the default label", () => {
  render(
    <ShimmeringText>
      <b>Bold</b> status
    </ShimmeringText>
  );
  expect(screen.getByRole("status")).toHaveTextContent("Bold status");
  render(<ShimmeringText />);
  expect(screen.getByText("Loading. Please wait")).toBeInTheDocument();
});

import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageFooter } from "../../v2/page-footer";
it("keeps action slots functional", async () => {
  const onClick = vi.fn();
  render(
    <PageFooter
      description="Settings"
      actions={<button onClick={onClick}>Save</button>}
    />
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onClick).toHaveBeenCalledOnce();
  expect(screen.getByText("Settings")).toBeInTheDocument();
});
it("supports stacked mobile layout and content slots", () => {
  render(
    <PageFooter layout="mobile" data-testid="footer">
      <span>Context</span>
    </PageFooter>
  );
  expect(screen.getByTestId("footer")).toHaveClass("flex-col", "py-4");
  expect(screen.getByText("Context")).toBeInTheDocument();
});

import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UiCard, UiCardTitle, UiCardDescription } from "../../v2/ui-card";
it("exposes keyboard activation for interactive cards", async () => {
  const onClick = vi.fn();
  render(
    <UiCard onClick={onClick} selected>
      <UiCardTitle>Workspace</UiCardTitle>
    </UiCard>
  );
  const card = screen.getByRole("button", { name: "Workspace" });
  card.focus();
  await userEvent.keyboard("{Enter} ");
  expect(onClick).toHaveBeenCalledTimes(2);
  expect(card).toHaveAttribute("aria-pressed", "true");
});
it("blocks disabled cards", async () => {
  const onClick = vi.fn();
  render(
    <UiCard disabled onClick={onClick}>
      Disabled
    </UiCard>
  );
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).not.toHaveBeenCalled();
  expect(screen.getByRole("button")).not.toHaveAttribute("tabindex");
});
it("keeps passive content out of the tab order", () => {
  render(
    <UiCard>
      <UiCardTitle>Report</UiCardTitle>
      <UiCardDescription>Weekly summary</UiCardDescription>
    </UiCard>
  );
  expect(screen.getByRole("heading", { name: "Report" })).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

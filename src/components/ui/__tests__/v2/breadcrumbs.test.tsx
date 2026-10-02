import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumbs } from "../../v2/breadcrumbs";
const items = ["Home", "Workspace", "Settings", "Integrations", "Webhook"].map(
  (label) => ({ label, href: "/" + label.toLowerCase() })
);
describe("Breadcrumbs", () => {
  it("marks only the final page as current", () => {
    render(<Breadcrumbs items={items.slice(0, 3)} />);
    expect(screen.getByLabelText("Breadcrumb")).toHaveRole("navigation");
    expect(screen.getByText("Settings")).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/home"
    );
  });
  it("selects hidden pages and closes even when navigation is prevented", async () => {
    const navigate = vi.fn((e) => e);
    render(
      <Breadcrumbs
        items={items}
        maxItems={3}
        onNavigate={(item, index, event) => {
          event.preventDefault();
          navigate(item, index);
        }}
      />
    );
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Show hidden pages" })
    );
    await userEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    expect(navigate).toHaveBeenCalledWith(items[2], 2);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Show hidden pages" })
      ).toHaveFocus()
    );
  });
  it("forwards a navigation callback for visible links", async () => {
    const navigate = vi.fn();
    render(
      <Breadcrumbs
        items={items.slice(0, 2)}
        onNavigate={(item, index, event) => {
          event.preventDefault();
          navigate(item, index);
        }}
      />
    );
    await userEvent.click(screen.getByRole("link"));
    expect(navigate).toHaveBeenCalledWith(items[0], 0);
  });
  it("renders an empty navigation without crashing", () => {
    render(<Breadcrumbs items={[]} />);
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BotListHeader } from "../bot-list-header";
import { assertNoBootstrapMarginBleed } from "../../../ui/__tests__/utils/bootstrap-compat";

describe("BotListHeader", () => {
  it("renders with default props (no title or subtitle)", () => {
    const { container } = render(<BotListHeader />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector("h1")).not.toBeInTheDocument();
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<BotListHeader title="AI Bot" />);
    expect(screen.getByText("AI Bot")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<BotListHeader subtitle="Create & manage AI bots" />);
    expect(screen.getByText("Create & manage AI bots")).toBeInTheDocument();
  });

  it("renders both title and subtitle", () => {
    render(
      <BotListHeader
        title="My Bots"
        subtitle="Manage your bots"
      />
    );
    expect(screen.getByText("My Bots")).toBeInTheDocument();
    expect(screen.getByText("Manage your bots")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <BotListHeader title="Test" className="custom-header" />
    );
    expect(container.firstChild).toHaveClass("custom-header");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<BotListHeader title="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has Bootstrap margin reset on paragraph when subtitle is present", () => {
    const { container } = render(
      <BotListHeader title="T" subtitle="Sub" />
    );
    assertNoBootstrapMarginBleed(container);
  });

  it("passes through additional props", () => {
    render(
      <BotListHeader title="Test" data-testid="header-block" aria-label="Page title" />
    );
    const el = screen.getByTestId("header-block");
    expect(el).toHaveAttribute("aria-label", "Page title");
  });

  it("applies default variant layout classes", () => {
    const { container } = render(
      <BotListHeader title="Test" subtitle="Sub" variant="default" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("flex", "flex-col", "gap-1.5", "shrink", "min-w-0");
  });

  it("applies withSearch variant layout classes", () => {
    const { container } = render(
      <BotListHeader
        title="Test"
        variant="withSearch"
        rightContent={<span data-testid="right">Right</span>}
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass(
      "border-b",
      "border-semantic-border-layout",
      "sm:flex-row",
      "sm:justify-between"
    );
    expect(screen.getByTestId("right")).toHaveTextContent("Right");
  });

  it("renders rightContent when variant is withSearch", () => {
    render(
      <BotListHeader
        title="Header"
        variant="withSearch"
        rightContent={<button type="button">Search</button>}
      />
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });
});

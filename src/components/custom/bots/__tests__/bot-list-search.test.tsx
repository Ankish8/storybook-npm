import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BotListSearch } from "../bot-list-search";

describe("BotListSearch", () => {
  it("renders with default placeholder", () => {
    render(<BotListSearch />);
    expect(screen.getByPlaceholderText("Search bot...")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search bot..." })).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<BotListSearch placeholder="Filter bots..." />);
    expect(screen.getByPlaceholderText("Filter bots...")).toBeInTheDocument();
  });

  it("calls onSearch when user types", () => {
    const onSearch = vi.fn();
    render(<BotListSearch onSearch={onSearch} />);
    fireEvent.change(screen.getByPlaceholderText("Search bot..."), {
      target: { value: "lead" },
    });
    expect(onSearch).toHaveBeenCalledWith("lead");
  });

  it("updates displayed value when controlled", () => {
    render(<BotListSearch value="controlled" onSearch={() => {}} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("controlled");
  });

  it("uses defaultValue for uncontrolled initial value", () => {
    render(<BotListSearch defaultValue="initial" />);
    expect(screen.getByRole("textbox")).toHaveValue("initial");
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <BotListSearch className="custom-search" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-search");
  });

  it("forwards ref to wrapper div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<BotListSearch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders Search icon", () => {
    const { container } = render(<BotListSearch />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BotListCreateCard } from "../bot-list-create-card";

describe("BotListCreateCard", () => {
  it("renders with default label", () => {
    render(<BotListCreateCard />);
    expect(screen.getByText("Create new bot")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create new bot" })).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<BotListCreateCard label="Add bot" />);
    expect(screen.getByText("Add bot")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add bot" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<BotListCreateCard onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Create new bot" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not throw when clicked without onClick handler", () => {
    render(<BotListCreateCard />);
    expect(() => {
      fireEvent.click(screen.getByRole("button", { name: "Create new bot" }));
    }).not.toThrow();
  });

  it("applies custom className", () => {
    const { container } = render(
      <BotListCreateCard className="custom-card" />
    );
    const button = container.firstChild as HTMLButtonElement;
    expect(button).toHaveClass("custom-card");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<BotListCreateCard ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("is a button with type button", () => {
    render(<BotListCreateCard />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("type", "button");
  });
});

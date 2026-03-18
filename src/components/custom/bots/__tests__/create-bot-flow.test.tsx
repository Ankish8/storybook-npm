import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateBotFlow } from "../create-bot-flow";

describe("CreateBotFlow", () => {
  it("renders Create new bot card", () => {
    render(<CreateBotFlow />);
    expect(screen.getByText("Create new bot")).toBeInTheDocument();
  });

  it("opens modal when create card is clicked", () => {
    render(<CreateBotFlow />);
    fireEvent.click(screen.getByText("Create new bot").closest("button")!);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onSubmit when modal form is submitted", () => {
    const onSubmit = vi.fn();
    render(<CreateBotFlow onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Create new bot").closest("button")!);
    const nameInput = screen.getByPlaceholderText("Enter bot name");
    fireEvent.change(nameInput, { target: { value: "My Bot" } });
    const createButton = screen.getByRole("button", { name: "Create" });
    fireEvent.click(createButton);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "My Bot", type: expect.any(Number) })
    );
  });

  it("applies custom className to root", () => {
    const { container } = render(<CreateBotFlow className="custom-flow" />);
    const wrapper = container.querySelector(".custom-flow");
    expect(wrapper).toBeInTheDocument();
  });

  it("forwards ref to root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CreateBotFlow ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

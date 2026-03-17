import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotListAction } from "../bot-list-action";

describe("BotListAction", () => {
  it("renders the default trigger (More options button)", () => {
    render(<BotListAction />);
    expect(screen.getByLabelText("More options")).toBeInTheDocument();
  });

  it("opens dropdown and shows Edit and Delete when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<BotListAction />);
    await user.click(screen.getByLabelText("More options"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onEdit when Edit is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<BotListAction onEdit={onEdit} />);
    await user.click(screen.getByLabelText("More options"));
    await user.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<BotListAction onDelete={onDelete} />);
    await user.click(screen.getByLabelText("More options"));
    await user.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("does not throw when opening menu without callbacks", async () => {
    const user = userEvent.setup();
    render(<BotListAction />);
    await user.click(screen.getByLabelText("More options"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders custom trigger when provided", () => {
    render(
      <BotListAction trigger={<button type="button">Actions</button>} />
    );
    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
    expect(screen.queryByLabelText("More options")).not.toBeInTheDocument();
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <BotListAction className="my-action-menu" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("my-action-menu");
  });

  it("forwards ref to wrapper div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<BotListAction ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

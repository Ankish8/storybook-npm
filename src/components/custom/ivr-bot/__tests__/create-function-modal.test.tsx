import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateFunctionModal } from "../create-function-modal";

const noop = () => {};

describe("CreateFunctionModal", () => {
  it("does not render content when closed", () => {
    render(
      <CreateFunctionModal open={false} onOpenChange={noop} />
    );
    expect(screen.queryByText("Create Function")).not.toBeInTheDocument();
  });

  it("renders step 1 when open", () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    expect(screen.getByText("Create Function")).toBeInTheDocument();
    expect(screen.getByLabelText(/Function Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("disables Next button when fields are empty", () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    const nextBtn = screen.getByRole("button", { name: /Next/i });
    expect(nextBtn).toBeDisabled();
  });

  it("enables Next button when both fields are filled", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(
      screen.getByLabelText(/Function Name/i),
      "TestFunc"
    );
    await user.type(screen.getByLabelText(/Prompt/i), "Some prompt");
    expect(screen.getByRole("button", { name: /Next/i })).not.toBeDisabled();
  });

  it("shows character counter for function name", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "Hello");
    expect(screen.getByText(/5\/30/)).toBeInTheDocument();
  });

  it("advances to step 2 on Next click", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), "Test prompt");
    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/API url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
  });

  it("goes back to step 1 from step 2", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), "Test prompt");
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Back/i }));
    expect(screen.getByLabelText(/Function Name/i)).toBeInTheDocument();
  });

  it("renders tab navigation in step 2", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), "Test prompt");
    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/Header \(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Query params \(0\)/)).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("shows Body textarea when Body tab is clicked", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), "Test prompt");
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByText("Body"));
    expect(screen.getByPlaceholderText(/Enter request body/i)).toBeInTheDocument();
    expect(screen.getByText(/0\/4000/)).toBeInTheDocument();
  });

  it("calls onSubmit with complete data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), "My prompt");
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "MyFunc", prompt: "My prompt" })
    );
  });

  it("calls onOpenChange when closed after submit", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={onOpenChange} />
    );
    // Advance to step 2 first
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), "My prompt");
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

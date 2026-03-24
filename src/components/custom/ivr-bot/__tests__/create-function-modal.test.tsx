import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateFunctionModal } from "../create-function-modal";

const noop = () => {};
// A prompt string ≥ 100 chars for meeting the default promptMinLength
const VALID_PROMPT =
  "This is a valid prompt that meets the minimum character length requirement for the create function modal test cases here.";

// No delay so typing long prompt doesn't timeout (userEvent default delay * 100+ chars > 5s)
const user = userEvent.setup({ delay: null });

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

  it("enables Next button when both fields are filled and prompt meets min length", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(
      screen.getByLabelText(/Function Name/i),
      "TestFunc"
    );
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    expect(screen.getByRole("button", { name: /Next/i })).not.toBeDisabled();
  });

  it("shows character counter for function name", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "Hello");
    expect(screen.getByText(/5\/100/)).toBeInTheDocument();
  });

  it("replaces spaces in function name with underscores and does not show format error", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    const input = screen.getByLabelText(/Function Name/i);
    await user.type(input, "my test func");
    expect(input).toHaveValue("my_test_func");
    expect(
      screen.queryByText(
        /Must start with a letter and contain only letters, numbers, and underscores/i
      )
    ).not.toBeInTheDocument();
  });

  it("advances to step 2 on Next click", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/API url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
  });

  it("goes back to step 1 from step 2", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Back/i }));
    expect(screen.getByLabelText(/Function Name/i)).toBeInTheDocument();
  });

  it("renders tab navigation in step 2 (Body tab always visible)", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/Header \(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Query params \(0\)/)).toBeInTheDocument();
    // Body tab is always visible regardless of HTTP method
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("shows Body textarea when Body tab is clicked (POST method)", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    // Switch to POST to reveal Body tab
    await user.selectOptions(screen.getByLabelText(/HTTP method/i), "POST");
    await user.click(screen.getByText("Body"));
    expect(screen.getByPlaceholderText(/Enter request body/i)).toBeInTheDocument();
    expect(screen.getByText(/0\/4000/)).toBeInTheDocument();
  });

  it("calls onSubmit with complete data", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "MyFunc", prompt: VALID_PROMPT })
    );
  });

  it("calls onOpenChange when closed after submit", async () => {
    const onOpenChange = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={onOpenChange} />
    );
    // Advance to step 2 first
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

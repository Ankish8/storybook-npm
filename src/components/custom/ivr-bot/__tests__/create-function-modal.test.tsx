import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateFunctionModal } from "../create-function-modal";

const noop = () => {};
// A prompt string ≥ 100 chars for meeting the default promptMinLength
const VALID_PROMPT =
  "This is a valid prompt that meets the minimum character length requirement for the create function modal test cases here.";

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
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(
      screen.getByLabelText(/Function Name/i),
      "TestFunc"
    );
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    expect(screen.getByRole("button", { name: /Next/i })).not.toBeDisabled();
  });

  it("shows character counter for function name", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "Hello");
    expect(screen.getByText(/5\/100/)).toBeInTheDocument();
  });

  it("advances to step 2 on Next click", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/API url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
  });

  it("goes back to step 1 from step 2", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Back/i }));
    expect(screen.getByLabelText(/Function Name/i)).toBeInTheDocument();
  });

  it("renders tab navigation in step 2 (Body tab only for POST/PUT/PATCH)", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/Header \(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Query params \(0\)/)).toBeInTheDocument();
    // Body tab is hidden for GET (default method)
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
    // Switch to POST — Body tab appears
    await user.selectOptions(screen.getByLabelText(/HTTP method/i), "POST");
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("shows Body textarea when Body tab is clicked (POST method)", async () => {
    const user = userEvent.setup();
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
    const user = userEvent.setup();
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
    const user = userEvent.setup();
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

  it("shows error for invalid function name on blur", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    const nameInput = screen.getByLabelText(/Function Name/i);
    await user.type(nameInput, "123invalid");
    await user.tab();
    expect(screen.getByText(/Must start with a letter/)).toBeInTheDocument();
  });

  it("disables Next when function name fails regex", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "___");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
  });

  it("shows error when URL does not start with http", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} initialStep={2} />);
    const urlInput = screen.getByPlaceholderText(/Enter URL/i);
    await user.type(urlInput, "ftp://example.com");
    await user.tab();
    expect(screen.getByText(/URL must start with http/)).toBeInTheDocument();
  });

  it("shows error for invalid JSON body on blur", async () => {
    const user = userEvent.setup();
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        initialStep={2}
        initialTab="body"
      />
    );
    // Switch to POST so body tab is visible
    await user.selectOptions(screen.getByLabelText(/HTTP method/i), "POST");
    await user.click(screen.getByText("Body"));
    const bodyTextarea = screen.getByPlaceholderText(/Enter request body/i);
    await user.type(bodyTextarea, "not valid json");
    await user.tab();
    expect(screen.getByText(/Body must be valid JSON/)).toBeInTheDocument();
  });

  it("replaces spaces with hyphens in header keys", async () => {
    const user = userEvent.setup();
    render(<CreateFunctionModal open onOpenChange={noop} initialStep={2} />);
    // Add a header row
    await user.click(screen.getByText("Add row"));
    const keyInputs = screen.getAllByPlaceholderText("Key");
    await user.type(keyInputs[0], "my key");
    // Spaces should be replaced with hyphens
    expect(keyInputs[0]).toHaveValue("my-key");
  });

  it("uses promptMaxLength default of 1000", () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    expect(screen.getByText(/0\/1000/)).toBeInTheDocument();
  });
});

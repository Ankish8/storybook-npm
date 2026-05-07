import * as React from "react";
import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateFunctionModal } from "../create-function-modal";
import { HEADER_MAX_ROWS } from "../create-function-validation";
import type { VariableGroup } from "../types";

const noop = () => {};

const agentMessageOptionalField = () =>
  screen.getByRole("textbox", { name: "Agent Message (Optional)" });

const agentMessageRequiredField = () =>
  screen.getByRole("textbox", { name: "Agent Message *" });
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

  it('shows "Edit Function" when isEditing is true', () => {
    render(<CreateFunctionModal open onOpenChange={noop} isEditing />);
    expect(screen.getByText("Edit Function")).toBeInTheDocument();
  });

  it("pre-fills step 1 from initialData when open", () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        initialData={{
          name: "PrefilledFunc",
          botMessage: "Hello from bot",
          prompt: VALID_PROMPT,
        }}
      />
    );
    expect(screen.getByLabelText(/Function Name/i)).toHaveValue("PrefilledFunc");
    expect(agentMessageOptionalField()).toHaveValue("Hello from bot");
    expect(screen.getByLabelText(/Prompt/i)).toHaveValue(VALID_PROMPT);
  });

  it("renders step 1 when open", () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    expect(screen.getByText("Create Function")).toBeInTheDocument();
    expect(screen.getByLabelText(/Function Name/i)).toBeInTheDocument();
    expect(agentMessageOptionalField()).toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("does not render Agent Message when showAgentMessage is false", () => {
    render(
      <CreateFunctionModal open onOpenChange={noop} showAgentMessage={false} />
    );
    expect(
      screen.queryByRole("textbox", { name: "Agent Message (Optional)" })
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt/i)).toBeInTheDocument();
  });

  it("disables Next with only a valid name when Agent Message is hidden (Prompt still required)", async () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        showAgentMessage={false}
      />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "OnlyName");
    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
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
    expect(screen.getByText(/5\/30/)).toBeInTheDocument();
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

  it("replaces spaces in variable name with underscores and saves normalized name", async () => {
    const onAddVariable = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onAddVariable={onAddVariable} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));

    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const valueInput = screen.getByPlaceholderText("Type {{ to add variables");
    await user.click(valueInput);
    await user.type(valueInput, "{{{{");
    await user.click(screen.getByRole("button", { name: /Add new variable/i }));

    const varNameInput = screen.getByPlaceholderText("e.g., customer_name");
    await user.type(varNameInput, "my order id");
    expect(varNameInput).toHaveValue("my_order_id");
    expect(varNameInput).toHaveAttribute("aria-invalid", "false");

    await user.type(
      screen.getByPlaceholderText("What this variable represents"),
      "Order identifier"
    );
    await user.click(screen.getByRole("button", { name: /^Save$/ }));

    expect(onAddVariable).toHaveBeenCalledWith(
      expect.objectContaining({ name: "my_order_id", description: "Order identifier" })
    );
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

  it("advances to step 2 on Next in read-only mode without step-1 validation", async () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        disabled
        initialData={{
          name: "ViewFunc",
          botMessage: "",
          prompt: "too short for edit mode",
          method: "GET",
          url: "https://example.com/",
          headers: [],
          queryParams: [],
          body: "",
        }}
      />
    );
    const next = screen.getByRole("button", { name: /Next/i });
    expect(next).not.toBeDisabled();
    await user.click(next);
    expect(screen.getByText(/API url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled();
  });

  it("allows Back from step 2 in read-only mode", async () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        disabled
        initialStep={2}
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "GET",
          url: "https://api.example.com/",
          headers: [],
          queryParams: [],
          body: "",
        }}
      />
    );
    expect(screen.getByRole("button", { name: /Back/i })).not.toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Back/i }));
    expect(screen.getByLabelText(/Function Name/i)).toBeInTheDocument();
  });

  it("disables Back and Submit when submitLoading prop is true", () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        submitLoading
        initialStep={2}
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "GET",
          url: "https://api.example.com/",
          headers: [{ id: "h1", key: "X", value: "1" }],
          queryParams: [],
          body: "",
        }}
      />
    );
    expect(screen.getByRole("button", { name: /Back/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled();
  });

  it("goes back to step 1 from step 2", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Back/i }));
    expect(screen.getByLabelText(/Function Name/i)).toBeInTheDocument();
  });

  it("disables header Add row at maximum header count and clamps initial headers", async () => {
    const manyHeaders = Array.from({ length: HEADER_MAX_ROWS + 4 }, (_, i) => ({
      id: `h${i}`,
      key: `K${i}`,
      value: `V${i}`,
    }));
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        initialStep={2}
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "GET",
          url: "https://api.example.com/",
          headers: manyHeaders,
          queryParams: [],
          body: "",
        }}
      />
    );

    expect(screen.getByText(new RegExp(`Header \\(${HEADER_MAX_ROWS}\\)`))).toBeInTheDocument();
    const addRow = screen.getByRole("button", { name: /Add row/i });
    expect(addRow).toBeDisabled();
    expect(addRow).toHaveAttribute("title", `Maximum ${HEADER_MAX_ROWS} headers`);
  });

  it("respects maxQueryParamRows for query tab Add row and clamps initial rows", async () => {
    const maxQ = 5;
    const manyQ = Array.from({ length: maxQ + 3 }, (_, i) => ({
      id: `q${i}`,
      key: `K${i}`,
      value: `V${i}`,
    }));
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        initialStep={2}
        initialTab="queryParams"
        maxQueryParamRows={maxQ}
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "GET",
          url: "https://api.example.com/",
          headers: [],
          queryParams: manyQ,
          body: "",
        }}
      />
    );

    expect(screen.getByText(new RegExp(`Query params \\(${maxQ}\\)`))).toBeInTheDocument();
    const addRow = screen.getByRole("button", { name: /Add row/i });
    expect(addRow).toBeDisabled();
    expect(addRow).toHaveAttribute("title", `Maximum ${maxQ} query parameters`);
  });

  it("hides Body tab for GET and DELETE; shows Body tab for POST, PUT, and PATCH", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/Header \(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Query params \(0\)/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Body$/ })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/HTTP method/i), "DELETE");
    expect(screen.queryByRole("button", { name: /^Body$/ })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/HTTP method/i), "POST");
    expect(screen.getByRole("button", { name: /^Body$/ })).toBeInTheDocument();
  });

  it("shows Body textarea when Body tab is clicked (POST)", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "TestFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.selectOptions(screen.getByLabelText(/HTTP method/i), "POST");
    await user.click(screen.getByRole("button", { name: /^Body$/ }));
    expect(screen.getByPlaceholderText(/Enter request body/i)).toBeInTheDocument();
    expect(screen.getByText(/0\/4000/)).toBeInTheDocument();
  });

  it("blocks submit and shows errors when a header row is added but left empty", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/"
    );
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Header key and value are required/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/^Header key is required$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Header value is required$/i)).not.toBeInTheDocument();
  });

  it("shows one consolidated header message when multiple rows have missing fields", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/"
    );
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keysFirst = screen.getAllByPlaceholderText("Key");
    await user.type(keysFirst[0]!, "s");
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Please fill all required header keys and values/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Header value is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Header key and value are required/i)).not.toBeInTheDocument();
  });

  it("shows granular header messages when only one row is invalid among several rows", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/"
    );
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keys = screen.getAllByPlaceholderText("Key");
    const vals = screen.getAllByPlaceholderText("Type {{ to add variables");
    expect(keys).toHaveLength(2);
    await user.type(keys[1]!, "fc-");
    await user.type(vals[1]!, "cvcv");
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Header key and value are required/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Please fill all required header keys and values/i)
    ).not.toBeInTheDocument();
  });

  it("still shows invalid header key copy when multiple rows exist but a key fails format validation", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/"
    );
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keys = screen.getAllByPlaceholderText("Key");
    const vals = screen.getAllByPlaceholderText("Type {{ to add variables");
    await user.type(keys[0]!, "x@y");
    await user.type(vals[0]!, "v");
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keysAfterAdd = screen.getAllByPlaceholderText("Key");
    const valsAfterAdd = screen.getAllByPlaceholderText("Type {{ to add variables");
    await user.type(keysAfterAdd[1]!, "k");
    await user.type(valsAfterAdd[1]!, "w");
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Invalid header key/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Please fill all required header keys and values/i)
    ).not.toBeInTheDocument();
  });

  it("blocks submit and shows errors when a query param row is added but left empty", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/"
    );
    await user.click(screen.getByRole("button", { name: /Query params/i }));
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Query param key and value are required/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/^Query param key is required$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Query param value is required$/i)).not.toBeInTheDocument();
  });

  it("does not show submit validation on query rows added after a failed submit until Submit is clicked again", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/"
    );
    await user.click(screen.getByRole("button", { name: /Query params/i }));
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keyInputs = screen.getAllByPlaceholderText("Key");
    await user.type(keyInputs[0]!, "foo");
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Query param value is required/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keysAfterSecondAdd = screen.getAllByPlaceholderText("Key");
    expect(keysAfterSecondAdd).toHaveLength(2);
    // New empty row: no submit errors on it yet; only one row has errors → granular message
    expect(screen.queryByText(/Query param key is required/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Query param value is required/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Please fill all required query parameter keys and values/i)
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(
      screen.getByText(/Please fill all required query parameter keys and values/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Query param value is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Query param key and value are required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Query param key is required$/i)).not.toBeInTheDocument();
  });

  it("calls onSubmit with complete data", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    const urlInput = screen.getByPlaceholderText(/Enter URL or Type/i);
    await user.type(urlInput, "https://api.example.com/test");
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keyInputs = screen.getAllByPlaceholderText("Key");
    await user.type(keyInputs[0]!, "X-Api-Key");
    const valueInputs = screen.getAllByPlaceholderText("Type {{ to add variables");
    await user.type(valueInputs[0]!, "secret");
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "MyFunc",
        botMessage: "",
        prompt: VALID_PROMPT,
        url: "https://api.example.com/test",
      })
    );
  });

  it("calls onBotMessageBlur when Agent Message loses focus", async () => {
    const onBotMessageBlur = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onBotMessageBlur={onBotMessageBlur} />
    );
    const botMsg = agentMessageOptionalField();
    await user.type(botMsg, "Hi");
    fireEvent.blur(botMsg);
    expect(onBotMessageBlur).toHaveBeenCalledWith("Hi");
  });

  it("shows botMessageValidation under Agent Message", () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        botMessageValidation="Invalid bot message"
      />
    );
    expect(screen.getByText("Invalid bot message")).toBeInTheDocument();
  });

  it("shows invalid character message with icon styling on Agent Message blur", () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    const botMsg = agentMessageOptionalField();
    fireEvent.change(botMsg, { target: { value: "hello\u0000" } });
    fireEvent.blur(botMsg);
    expect(
      screen.getByText("Invalid characters not allowed.")
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("treats Agent Message as required when botMessageOptional is false", async () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        botMessageOptional={false}
      />
    );
    expect(screen.getByText("Agent Message")).toBeInTheDocument();
    expect(agentMessageRequiredField()).toBeRequired();
    await user.type(screen.getByLabelText(/Function Name/i), "ReqBot");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
    await user.type(agentMessageRequiredField(), "Hello");
    expect(screen.getByRole("button", { name: /Next/i })).not.toBeDisabled();
  });

  it("uses custom botMessagePlaceholder when provided", () => {
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        botMessagePlaceholder="Custom placeholder text"
      />
    );
    expect(
      screen.getByPlaceholderText("Custom placeholder text")
    ).toBeInTheDocument();
  });

  it("uses default Agent Message placeholder and shows the info tooltip trigger", () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    expect(
      screen.getByPlaceholderText(
        "e.g. Please wait while I get the data for you"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Agent Message \(Optional\): more information/i)
    ).toBeInTheDocument();
  });

  it("does not call onOpenChange on submit — parent closes from onSubmit if needed", async () => {
    const onOpenChange = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={onOpenChange} />
    );
    // Advance to step 2 first
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/"
    );
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const keyInputs = screen.getAllByPlaceholderText("Key");
    await user.type(keyInputs[0]!, "X-Custom");
    const valueInputs = screen.getAllByPlaceholderText("Type {{ to add variables");
    await user.type(valueInputs[0]!, "1");
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("does not submit or close when API URL is empty on Submit", async () => {
    const onSubmit = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={onOpenChange} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(screen.getByText("API URL is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("submits with URL only when no header or query rows are added (default)", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/test"
    );
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "MyFunc",
        botMessage: "",
        prompt: VALID_PROMPT,
        url: "https://api.example.com/test",
        headers: [],
        queryParams: [],
      })
    );
    expect(
      screen.queryByText(/Add at least one header or query parameter with both a key and a value/i)
    ).not.toBeInTheDocument();
  });

  it("blocks URL-only submit when requireHeaderOrQueryPair is true", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        onSubmit={onSubmit}
        requireHeaderOrQueryPair={true}
      />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.type(
      screen.getByPlaceholderText(/Enter URL or Type/i),
      "https://api.example.com/test"
    );
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Add at least one header or query parameter with both a key and a value/i)
    ).toBeInTheDocument();
  });

  const requiredFnVarGroups: VariableGroup[] = [
    {
      label: "Function variables",
      items: [{ name: "test_yogesh124", required: true, editable: true }],
    },
  ];

  it("shows required test variable error when parent omits variableGroups but user saved Required Yes on new variable", async () => {
    const onTestApi = vi.fn();
    render(<CreateFunctionModal open onOpenChange={noop} onTestApi={onTestApi} />);
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));

    await user.type(screen.getByPlaceholderText(/Enter URL or Type/i), "https://api.example.com/");
    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const valueInput = screen.getByPlaceholderText("Type {{ to add variables");
    await user.click(valueInput);
    await user.type(valueInput, "{{{{");
    await user.click(screen.getByRole("button", { name: /Add new variable/i }));

    await user.type(screen.getByPlaceholderText("e.g., customer_name"), "order_id");
    await user.type(
      screen.getByPlaceholderText("What this variable represents"),
      "API order identifier"
    );
    await user.click(screen.getByRole("radio", { name: /^Yes$/i }));
    await user.click(screen.getByRole("button", { name: /^Save$/ }));

    await user.click(screen.getByRole("button", { name: /^Test$/i }));
    expect(onTestApi).not.toHaveBeenCalled();
    expect(screen.getByText("Value is required for this key")).toBeInTheDocument();
  });

  it("shows required test variable error when Test is clicked with empty value", async () => {
    const onTestApi = vi.fn();
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        onTestApi={onTestApi}
        variableGroups={requiredFnVarGroups}
        initialStep={2}
        initialTab="header"
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "GET",
          url: "https://api.example.com/{{function.test_yogesh124}}",
          headers: [],
          queryParams: [],
          body: "",
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: /^Test$/i }));
    expect(onTestApi).not.toHaveBeenCalled();
    expect(screen.getByText("Value is required for this key")).toBeInTheDocument();
  });

  it("treats {{name}} placeholder as required when variableGroups marks name required", async () => {
    const onTestApi = vi.fn();
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        onTestApi={onTestApi}
        variableGroups={requiredFnVarGroups}
        initialStep={2}
        initialTab="header"
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "GET",
          url: "https://api.example.com/{{test_yogesh124}}",
          headers: [],
          queryParams: [],
          body: "",
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: /^Test$/i }));
    expect(onTestApi).not.toHaveBeenCalled();
    expect(screen.getByText("Value is required for this key")).toBeInTheDocument();
  });

  it("does not require test variable values on Submit — validation runs on Test only", async () => {
    const onSubmit = vi.fn();
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        onSubmit={onSubmit}
        variableGroups={requiredFnVarGroups}
        initialStep={2}
        initialTab="header"
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "GET",
          url: "https://api.example.com/{{function.test_yogesh124}}",
          headers: [{ id: "h1", key: "X-Test", value: "1" }],
          queryParams: [],
          body: "",
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(onSubmit).toHaveBeenCalled();
    expect(screen.queryByText("Value is required for this key")).not.toBeInTheDocument();
  });

  it("shows description character count and blocks save when description exceeds 2000 characters", async () => {
    render(<CreateFunctionModal open onOpenChange={noop} />);
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));

    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const valueInput = screen.getByPlaceholderText("Type {{ to add variables");
    await user.click(valueInput);
    await user.type(valueInput, "{{{{");
    await user.click(screen.getByRole("button", { name: /Add new variable/i }));

    const desc = screen.getByPlaceholderText("What this variable represents");
    expect(screen.getByText("0/2000")).toBeInTheDocument();

    const long = "x".repeat(2001);
    await act(() => {
      fireEvent.change(desc, { target: { value: long } });
    });

    expect(screen.getByText("2001/2000")).toBeInTheDocument();
    expect(
      screen.getByText(/Description cannot exceed 2000 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Save$/ })).toBeDisabled();
  });

  it("replaces open {{ trigger with {{name}} after Create new variable saves", async () => {
    const onAddVariable = vi.fn();
    render(
      <CreateFunctionModal open onOpenChange={noop} onAddVariable={onAddVariable} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));

    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const valueInput = screen.getByPlaceholderText("Type {{ to add variables");
    await user.click(valueInput);
    // user-event: `{` must be doubled to type a literal brace
    await user.type(valueInput, "{{{{");

    await user.click(screen.getByRole("button", { name: /Add new variable/i }));

    await user.type(screen.getByPlaceholderText("e.g., customer_name"), "order_id");
    await user.type(
      screen.getByPlaceholderText("What this variable represents"),
      "External order id"
    );
    await user.click(screen.getByRole("button", { name: /^Save$/ }));

    expect(onAddVariable).toHaveBeenCalledWith(
      expect.objectContaining({ name: "order_id", description: "External order id" })
    );
    expect(valueInput).toHaveValue("{{function.order_id}}");
  });

  it("renames {{function.*}} placeholders across the function form when a variable is edited", async () => {
    const onEditVariable = vi.fn();
    render(
      <CreateFunctionModal
        open
        onOpenChange={noop}
        onEditVariable={onEditVariable}
        variableGroups={[
          {
            label: "Function variables",
            items: [{ name: "yogesh", editable: true }],
          },
        ]}
        initialStep={2}
        initialTab="header"
        initialData={{
          name: "MyFunc",
          prompt: VALID_PROMPT,
          method: "POST",
          url: "https://api.example.com/{{function.yogesh}}",
          headers: [{ id: "h1", key: "Authorization", value: "{{function.yogesh}}" }],
          queryParams: [],
          body: '{"x":"{{function.yogesh}}"}',
        }}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /Edit variable function\.yogesh/i })
    );
    const varNameInput = screen.getByPlaceholderText("e.g., customer_name");
    await user.clear(varNameInput);
    await user.type(varNameInput, "yogesh2");
    await user.type(
      screen.getByPlaceholderText("What this variable represents"),
      "Yogesh placeholder"
    );
    await user.click(screen.getByRole("button", { name: /Save Changes/i }));

    expect(screen.getByPlaceholderText(/Enter URL or Type/i)).toHaveValue(
      "https://api.example.com/{{function.yogesh2}}"
    );
    expect(screen.getByPlaceholderText("Type {{ to add variables")).toHaveValue(
      "{{function.yogesh2}}"
    );
    await user.click(screen.getByRole("button", { name: /^Body$/ }));
    expect(screen.getByPlaceholderText(/Enter request body/i)).toHaveValue(
      '{"x":"{{function.yogesh2}}"}'
    );
    expect(onEditVariable).toHaveBeenCalledWith(
      "yogesh",
      expect.objectContaining({ name: "yogesh2", description: "Yogesh placeholder" })
    );
  });

  it('shows "Description is required" when Save is clicked with empty description', async () => {
    render(
      <CreateFunctionModal open onOpenChange={noop} onAddVariable={noop} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));

    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const valueInput = screen.getByPlaceholderText("Type {{ to add variables");
    await user.click(valueInput);
    await user.type(valueInput, "{{{{");
    await user.click(screen.getByRole("button", { name: /Add new variable/i }));

    await user.type(screen.getByPlaceholderText("e.g., customer_name"), "order_id");
    await user.click(screen.getByRole("button", { name: /^Save$/ }));

    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What this variable represents")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it('shows "Value is required for this key" when Required is Yes and Save is clicked with empty variable name', async () => {
    render(
      <CreateFunctionModal open onOpenChange={noop} onAddVariable={noop} />
    );
    await user.type(screen.getByLabelText(/Function Name/i), "MyFunc");
    await user.type(screen.getByLabelText(/Prompt/i), VALID_PROMPT);
    await user.click(screen.getByRole("button", { name: /Next/i }));

    await user.click(screen.getByRole("button", { name: /Add row/i }));
    const valueInput = screen.getByPlaceholderText("Type {{ to add variables");
    await user.click(valueInput);
    await user.type(valueInput, "{{{{");
    await user.click(screen.getByRole("button", { name: /Add new variable/i }));

    await user.click(screen.getByRole("radio", { name: /^Yes$/i }));
    await user.click(screen.getByRole("button", { name: /^Save$/ }));

    expect(screen.getByText("Value is required for this key")).toBeInTheDocument();
    const nameField = screen.getByPlaceholderText("e.g., customer_name");
    expect(nameField).toHaveAttribute("aria-invalid", "true");
  });
}, { timeout: 30_000 });

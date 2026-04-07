import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FallbackPromptsCard } from "../fallback-prompts-card";

describe("FallbackPromptsCard", () => {
  it("renders the accordion header with title", () => {
    render(<FallbackPromptsCard data={{}} onChange={() => {}} />);
    expect(screen.getByText("Fallback Prompts")).toBeInTheDocument();
  });

  it("shows section header info control with accessible name (tooltip trigger)", () => {
    render(<FallbackPromptsCard data={{}} onChange={() => {}} />);
    expect(
      screen.getByLabelText("Fallback Prompts: more information")
    ).toBeInTheDocument();
  });

  it("shows non-interactive header icon when infoTooltip is empty string", () => {
    render(
      <FallbackPromptsCard data={{}} onChange={() => {}} infoTooltip="" />
    );
    expect(
      screen.queryByLabelText("Fallback Prompts: more information")
    ).not.toBeInTheDocument();
  });

  it("renders collapsed by default (trigger aria-expanded is false)", () => {
    render(<FallbackPromptsCard data={{}} onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("expands to show textarea fields when defaultOpen is true", () => {
    render(<FallbackPromptsCard data={{}} onChange={() => {}} defaultOpen />);
    expect(screen.getByText("Agent Busy Prompt")).toBeInTheDocument();
    expect(screen.getByText("No Extension Found")).toBeInTheDocument();
  });

  it("shows info icons beside field labels with accessible names when expanded", () => {
    render(<FallbackPromptsCard data={{}} onChange={() => {}} defaultOpen />);
    expect(
      screen.getByLabelText("Agent Busy Prompt: more information")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("No Extension Found: more information")
    ).toBeInTheDocument();
  });

  it("hides field label info icons when tooltip props are empty strings", () => {
    render(
      <FallbackPromptsCard
        data={{}}
        onChange={() => {}}
        defaultOpen
        agentBusyPromptTooltip=""
        noExtensionFoundPromptTooltip=""
      />
    );
    expect(
      screen.queryByLabelText("Agent Busy Prompt: more information")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("No Extension Found: more information")
    ).not.toBeInTheDocument();
  });

  it("expands when accordion trigger is clicked", () => {
    render(<FallbackPromptsCard data={{}} onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(screen.getByText("Agent Busy Prompt")).toBeInTheDocument();
    expect(screen.getByText("No Extension Found")).toBeInTheDocument();
  });

  it("shows provided values in the textareas", () => {
    render(
      <FallbackPromptsCard
        data={{
          agentBusyPrompt: "Agents are busy",
          noExtensionFoundPrompt: "No extension",
        }}
        onChange={() => {}}
        defaultOpen
      />
    );
    const textareas = screen.getAllByRole("textbox");
    expect(textareas[0]).toHaveValue("Agents are busy");
    expect(textareas[1]).toHaveValue("No extension");
  });

  it("calls onChange with agentBusyPrompt key when first textarea changes", () => {
    const onChange = vi.fn();
    render(
      <FallbackPromptsCard
        data={{ agentBusyPrompt: "" }}
        onChange={onChange}
        defaultOpen
      />
    );
    const [firstTextarea] = screen.getAllByRole("textbox");
    fireEvent.change(firstTextarea, { target: { value: "new prompt" } });
    expect(onChange).toHaveBeenCalledWith({ agentBusyPrompt: "new prompt" });
  });

  it("calls onChange with noExtensionFoundPrompt key when second textarea changes", () => {
    const onChange = vi.fn();
    render(
      <FallbackPromptsCard
        data={{ noExtensionFoundPrompt: "" }}
        onChange={onChange}
        defaultOpen
      />
    );
    const textareas = screen.getAllByRole("textbox");
    fireEvent.change(textareas[1], { target: { value: "ext not found" } });
    expect(onChange).toHaveBeenCalledWith({
      noExtensionFoundPrompt: "ext not found",
    });
  });

  it("shows character counter reflecting current value length", () => {
    render(
      <FallbackPromptsCard
        data={{ agentBusyPrompt: "hello" }}
        onChange={() => {}}
        defaultOpen
      />
    );
    expect(screen.getByText("5/25000")).toBeInTheDocument();
  });

  it("shows 0/25000 counter when field is empty", () => {
    render(
      <FallbackPromptsCard
        data={{ agentBusyPrompt: "" }}
        onChange={() => {}}
        defaultOpen
      />
    );
    expect(screen.getAllByText("0/25000").length).toBeGreaterThanOrEqual(1);
  });

  it("respects custom maxLength", () => {
    render(
      <FallbackPromptsCard
        data={{ agentBusyPrompt: "hi" }}
        onChange={() => {}}
        maxLength={500}
        defaultOpen
      />
    );
    expect(screen.getByText("2/500")).toBeInTheDocument();
  });

  it("disables textareas when disabled prop is true", () => {
    render(
      <FallbackPromptsCard
        data={{}}
        onChange={() => {}}
        disabled
        defaultOpen
      />
    );
    const textareas = screen.getAllByRole("textbox");
    textareas.forEach((ta) => expect(ta).toBeDisabled());
  });

  it("applies custom className to root element", () => {
    const { container } = render(
      <FallbackPromptsCard
        data={{}}
        onChange={() => {}}
        className="my-custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("applies card container classes", () => {
    const { container } = render(
      <FallbackPromptsCard data={{}} onChange={() => {}} />
    );
    expect(container.firstChild).toHaveClass(
      "bg-semantic-bg-primary",
      "border",
      "border-semantic-border-layout",
      "rounded-lg"
    );
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null };
    render(<FallbackPromptsCard data={{}} onChange={() => {}} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has the accordion trigger button accessible", () => {
    render(<FallbackPromptsCard data={{}} onChange={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onAgentBusyPromptBlur with current value on blur", () => {
    const onBlur = vi.fn();
    render(
      <FallbackPromptsCard
        data={{ agentBusyPrompt: "busy text" }}
        onChange={() => {}}
        onAgentBusyPromptBlur={onBlur}
        defaultOpen
      />
    );
    const [firstTextarea] = screen.getAllByRole("textbox");
    fireEvent.blur(firstTextarea);
    expect(onBlur).toHaveBeenCalledWith("busy text");
  });

  it("calls onNoExtensionFoundPromptBlur with current value on blur", () => {
    const onBlur = vi.fn();
    render(
      <FallbackPromptsCard
        data={{ noExtensionFoundPrompt: "not found text" }}
        onChange={() => {}}
        onNoExtensionFoundPromptBlur={onBlur}
        defaultOpen
      />
    );
    const textareas = screen.getAllByRole("textbox");
    fireEvent.blur(textareas[1]);
    expect(onBlur).toHaveBeenCalledWith("not found text");
  });
});
